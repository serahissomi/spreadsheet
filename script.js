const spreadSheetContainer = document.querySelector('#spreadsheet-container');
const exportButton = document.querySelector('#export-btn');
const rows = 10;
const columns = 10;
const spreadsheet = [];
const alpabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

class Cell {
    constructor(isHeader, disabled, data, row, column, rowName, columnName, active = false) {
        this.isHeader = isHeader;
        this.disabled = disabled;
        this.data = data;
        this.row = row;
        this.column = column;
        this.rowName = rowName;
        this.columnName = columnName;
        this.active = active;
    }
}

exportButton.onclick = function (e) {
    let csv = ""
    for (let i = 0; i < spreadsheet.length; i++) {
        if (i === 0) continue;
        csv +=
            spreadsheet[i]
                .filter((item) => !item.isHeader)
                .map((item) => item.data)
                .join(',') + '\r\n';
    }

    const csvobject = new Blob([csv])
    const csvUrl = URL.createObjectURL(csvobject)
    console.log('csv', csvUrl);

    const a = document.createElement('a');
    a.href = csvUrl;
    a.download = 'Spreadsheet File Name.csv';
    a.click();
}

initspreadsheet();


function initspreadsheet() {
    for (let i = 0; i < rows; i++) {
        let spreadsheetRow = [];
        for (let j = 0; j < columns; j++) {
            let cellData = '';
            let isHeader = false; // 헤더 설정을 위한 변수
            let disabled = false; // disabled 설정을 위한 변수
            if (j === 0) {
                cellData = i;
                isHeader = true; // column 0은 header
                disabled = true; // column 0은 disabled
            }
            if (i === 0) {
                cellData = alpabets[j-1]; // 한 블럭 건너뛰고 column 1부터 알파벳 넣기 위해 j-1
                isHeader = true; // row 0은 header
                disabled = true; // row 0은 disabled
            }
            if (!cellData) {
                cellData = '';
            }
            if (cellData <= 0) {
                cellData = '';
            }

            const rowName = i;
            const columnName = alpabets[j-1];

            const cell = new Cell(isHeader, disabled, cellData, i, j, rowName, columnName, false);
            spreadsheetRow.push(cell);
        }
        spreadsheet.push(spreadsheetRow);
    }
    drawSheet();
    console.log(spreadsheet);
}


function createCellEl(cell) {
    const cellEl = document.createElement('input');
    cellEl.className = 'cell';
    cellEl.id = 'cell_' + cell.row + cell.column;
    cellEl.value = cell.data;
    cellEl.disabled = cell.disabled;

    if (cell.isHeader) {
        cellEl.classList.add('header');
    }

    cellEl.onclick = () => handleCellClick(cell);
    cellEl.onchange = (e) => handleOnChange(e.target.value, cell);
    return cellEl;
}

function handleOnChange(data, cell) {
    cell.data = data;
}

function handleCellClick(cell) {
    clearHeaderActiveStates();
    const columnHeader = spreadsheet[0][cell.column];
    const rowHeader = spreadsheet[cell.row][0];
    const columnHeaderEl = getElFromRowCol(columnHeader.row, columnHeader.column);
    const rowHeaderEl = getElFromRowCol(rowHeader.row, rowHeader.column);
    columnHeaderEl.classList.add('active');
    rowHeaderEl.classList.add('active');
    document.querySelector('#cell-status').innerHTML = cell.columnName + cell.rowName;
}

function clearHeaderActiveStates() {
    const headers = document.querySelectorAll('.header');

    headers.forEach((header) => {
        header.classList.remove('active');
    });
}

function getElFromRowCol(row,col) {
    return document.querySelector('#cell_' + row + col);
}

function drawSheet() {
    for (let i = 0; i < spreadsheet.length; i++) {
        const rowContainerEl = document.createElement('div');
        rowContainerEl.className = 'cell-row';
        for (let j = 0; j < spreadsheet[i].length; j++) {
            const cell = spreadsheet[i][j];
            rowContainerEl.append(createCellEl(cell));
        }
        spreadSheetContainer.append(rowContainerEl);
    }
}

