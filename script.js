let defaultProperties = {
    text: "",
    "font-weight": "",
    "font-style": "",
    "text-decoration": "",
    "text-align": "left",
    "background-color": "#ffffff",
    "color": "#000000",
    "font-family": "Noto Sans",
    "font-size": "14px"
}

let cellData = {
    "Sheet1": {}
}

let selectedSheet = "Sheet1";

let totalSheets = 1;

let lastlyAddedSheet = 1

$(document).ready(function () {
    let cellContainer = $(".input-cell-container");

    for (let i = 1; i <= 100; i++) {

        let ans = "";

        let n = i;

        while (n > 0) {

            let rem = n % 26;

            if (rem == 0) {
                ans = "Z" + ans;
                n = Math.floor(n / 26) - 1;
            } else {
                ans = String.fromCharCode(rem - 1 + 65) + ans;
                n = Math.floor(n / 26);
            }
        }
        let columnName = $(`<div class="column-name colId-${i}" id="colCod-${ans} ">${ans}</div>`);

        $(".column-name-container").append(columnName);

        let rowName = $(`<div class="row-name" id="rowId-${i}">${i}</div>`);
        $(".row-name-container").append(rowName);
    }

    for (let i = 1; i <= 100; i++) {

        let row = $(`<div class="cell-row"></div>`)
        for (let j = 1; j <= 100; j++) {
            let colCode = $(`.colId-${j}`).attr("id").split("-")[1];
            let column = $(`<div class="input-cell" contenteditable="false" id="row-${i}-col-${j}" data="code-${colCode}"></div>`)
            row.append(column);
        }
        $(".input-cell-container").append(row);

    }

    $(".align-icon").click(function () {
        $(".align-icon.selected").removeClass("selected");
        $(this).addClass("selected");
    });

    $(".style-icon").click(function () {
        $(this).toggleClass("selected");
    });

    $(".input-cell").click(function (e) {
        if (e.ctrlKey == true) {
            let [rowId, colId] = getRowCol(this);
            if (rowId > 1) {
                let topCellSelected = $(`#row-${rowId - 1}-col-${colId}`).hasClass("selected");
                if (topCellSelected == true) {
                    $(this).addClass("top-cell-selected");
                    $(`#row-${rowId - 1}-col-${colId}`).addClass("bottom-cell-selected");
                }
            }
            if (rowId < 100) {
                let bottomCellSelected = $(`#row-${rowId + 1}-col-${colId}`).hasClass("selected");
                if (bottomCellSelected == true) {
                    $(this).addClass("bottom-cell-selected");
                    $(`#row-${rowId + 1}-col-${colId}`).addClass("top-cell-selected");
                }
            }
            if (colId > 1) {
                let leftCellSelected = $(`#row-${rowId}-col-${colId - 1}`).hasClass("selected");
                if (leftCellSelected == true) {
                    $(this).addClass("left-cell-selected");
                    $(`#row-${rowId}-col-${colId - 1}`).addClass("right-cell-selected");
                }
            }
            if (colId < 100) {
                let rightCellSelected = $(`#row-${rowId}-col-${colId + 1}`).hasClass("selected");
                if (rightCellSelected == true) {
                    $(this).addClass("right-cell-selected");
                    $(`#row-${rowId}-col-${colId + 1}`).addClass("left-cell-selected");
                }
            }
        } else {
            $(".input-cell.selected").removeClass("selected");
        }
        $(this).addClass("selected");
        changeHeader(this);
    });

    function changeHeader(ele) {
        let [rowId, colId] = getRowCol(ele);
        let cellInfo = defaultProperties;
        if (cellData[selectedSheet][rowId] && cellData[selectedSheet][rowId][colId]) {
            cellInfo = cellData[selectedSheet][rowId][colId];
        }
        cellInfo["font-weight"] ? $(".icon-bold").addClass("selected") : $(".icon-bold").removeClass("selected");
        cellInfo["font-style"] ? $(".icon-italic").addClass("selected") : $(".icon-italic").removeClass("selected");
        cellInfo["text-decoration"] ? $(".icon-underline").addClass("selected") : $(".icon-underline").removeClass("selected");
        let alignment = cellInfo["text-align"];
        $(".align-icon.selected").removeClass("selected");
        $(".icon-align-" + alignment).addClass("selected");
        $(".background-color-picker").val(cellInfo["background-color"]);
        $(".text-color-picker").val(cellInfo["color"]);

        $(".font-family-selector").val(cellInfo["font-family"]);
        $(".font-family-selector").css("font-family", cellInfo["font-family"]);

        $(".font-size-selector").val(cellInfo["font-size"]);




    }

    $(".input-cell").dblclick(function () {
        $(".input-cell.selected").removeClass("selected");
        $(this).addClass("selected");
        $(this).attr("contenteditable", "true");
        $(this).focus();
    });

    $(".input-cell").blur(function () {
        $(this).attr("contenteditable", "false");
        // $(this).focus();
        updateCell("text", $(this).text());
    });

    $(".input-cell-container").scroll(function () {
        // console.log(this.scrollLeft);
        $(".column-name-container").scrollLeft(this.scrollLeft);
        $(".row-name-container").scrollTop(this.scrollTop);
    });


    // console.log(ans);
});

function getRowCol(ele) {
    let idArray = $(ele).attr("id").split("-");

    let rowId = parseInt(idArray[1]);
    let colId = parseInt(idArray[3]);

    return [rowId, colId];
}


function updateCell(property, value, defaultPossible) {
    $(".input-cell.selected").each(function () {
        $(this).css(property, value)

        let [rowId, colId] = getRowCol(this);

        if (cellData[selectedSheet][rowId]) {
            if (cellData[selectedSheet][rowId][colId]) {
                cellData[selectedSheet][rowId][colId][property] = value;
            } else {
                cellData[selectedSheet][rowId][colId] = { ...defaultProperties };
                cellData[selectedSheet][rowId][colId][property] = value;
            }
        } else {
            cellData[selectedSheet][rowId] = {};
            cellData[selectedSheet][rowId][colId] = { ...defaultProperties };
            cellData[selectedSheet][rowId][colId][property] = value;
        }
        if (defaultPossible && (JSON.stringify(cellData[selectedSheet][rowId][colId]) === JSON.stringify(defaultProperties))) {
            delete cellData[selectedSheet][rowId][colId];
            if (Object.keys(cellData[selectedSheet][rowId]).length == 0) {
                delete cellData[selectedSheet][rowId];
            }
        }
    });
    console.log(cellData);
}
$(".icon-bold").click(function () {
    if ($(this).hasClass("selected")) {
        updateCell("font-weight", "", true);
    } else {
        updateCell("font-weight", "bold", false)
    }
});

$(".icon-italic").click(function () {
    if ($(this).hasClass("selected")) {
        updateCell("font-style", "", true);
    } else {
        updateCell("font-style", "italic", false)
    }
});

$(".icon-underline").click(function () {
    if ($(this).hasClass("selected")) {
        updateCell("text-decoration", "", true);
    } else {
        updateCell("text-decoration", "underline", false)
    }
});

$(".icon-align-left").click(function () {
    // console.log("Left Align Clicked");
    if (!$(this).hasClass("selected")) {
        updateCell("text-align", "left", true);
    }
});

$(".icon-align-center").click(function () {
    if (!$(this).hasClass("selected")) {
        updateCell("text-align", "center", true);
    }
});

$(".icon-align-right").click(function () {
    if (!$(this).hasClass("selected")) {
        updateCell("text-align", "right", true);
    }
});

$(".color-fill-icon").click(function () {
    $(".background-color-picker").click();
});

$(".color-fill-text").click(function () {
    $(".text-color-picker").click();
});

$(".background-color-picker").change(function () {
    updateCell("background-color", $(this).val());
});

$(".text-color-picker").change(function () {
    updateCell("color", $(this).val());
});

$(".font-family-selector").change(function () {
    updateCell("font-family", $(this).val());
    $(".font-family-selector").css("font-family", $(this).val());

});

$(".font-size-selector").change(function () {
    updateCell("font-size", $(this).val());
});



function emptySheet() {
    let sheetInfo = cellData[selectedSheet];
    for (let i of Object.keys(sheetInfo)) {
        for (let j of Object.keys(sheetInfo[i])) {
            $(`#row-${i}-col-${j}`).text("");
            $(`#row-${i}-col-${j}`).css("background-color", "#ffffff");
            $(`#row-${i}-col-${j}`).css("color", "#000000");
            $(`#row-${i}-col-${j}`).css("text-align", "left");
            $(`#row-${i}-col-${j}`).css("font-weight", "");
            $(`#row-${i}-col-${j}`).css("font-style", "");
            $(`#row-${i}-col-${j}`).css("text-decoration", "");
            $(`#row-${i}-col-${j}`).css("font-family", "Noto Sans");
            $(`#row-${i}-col-${j}`).css("font-size", "14px");
        }
    }
}

function loadSheet() {
    let sheetInfo = cellData[selectedSheet];
    for (let i of Object.keys(sheetInfo)) {
        for (let j of Object.keys(sheetInfo[i])) {
            let cellInfo = cellData[selectedSheet][i][j];
            $(`#row-${i}-col-${j}`).text(cellInfo["text"]);
            $(`#row-${i}-col-${j}`).css("background-color", cellInfo["background-color"]);
            $(`#row-${i}-col-${j}`).css("color", cellInfo["color"]);
            $(`#row-${i}-col-${j}`).css("text-align", cellInfo["text-align"]);
            $(`#row-${i}-col-${j}`).css("font-weight", cellInfo["font-weight"]);
            $(`#row-${i}-col-${j}`).css("font-style", cellInfo["font-style"]);
            $(`#row-${i}-col-${j}`).css("text-decoration", cellInfo["text-decoration"]);
            $(`#row-${i}-col-${j}`).css("font-family", cellInfo["font-family"]);
            $(`#row-${i}-col-${j}`).css("font-size", cellInfo["font-size"]);
        }
    }
}

$(".icon-add").click(function () {
    emptySheet();
    $(".sheet-tab.selected").removeClass("selected");
    let sheetName = "Sheet" + (lastlyAddedSheet + 1);
    cellData[sheetName] = {};
    totalSheets += 1;
    lastlyAddedSheet += 1;
    selectedSheet = sheetName;
    $(".sheet-tab-container").append(`<div class="sheet-tab selected">${sheetName}</div>`);
    addSheetEvents();

});

function addSheetEvents() {
    $(".sheet-tab.selected").click(function () {
        if (!$(this).hasClass("selected")) {
            selectSheet(this);
        }
    })

    $(".sheet-tab.selected").contextmenu(function (e) {
        e.preventDefault();
        selectSheet(this);
        if ($(".sheet-options-modal").length == 0) {

            $(".container").append(`<div class="sheet-options-modal">
                <div class="sheet-rename">Rename</div>
                <div class="sheet-delete">Delete</div>
                </div>`);
            $(".sheet-rename").click(function () {
                $(".container").append(`<div class="sheet-rename-modal">
                        <h4 class="modal-title">Rename Sheet To: </h4>
                        <input type="text" class="new-sheet-name" placeholder="Sheet Name" />
                        <div class="action-buttons">
                        <div class="submit-button">Rename</div>
                        <div class="cancel-button">Cancel</div>
                    </div>
                </div>`)

                $(".cancel-button").click(function () {
                    $(".sheet-rename-modal").remove();
                })
                $(".submit-button").click(function () {
                    let newSheetName = $(".new-sheet-name").val();

                    $(".sheet-tab.selected").text(newSheetName);
                    let newCellData = {};
                    for (let key in cellData) {
                        if (key != selectedSheet) {
                            newCellData[key] = cellData[key];
                        } else {
                            newCellData[newSheetName] = cellData[key];
                        }
                    }
                    cellData = newCellData;
                    selectedSheet = newSheetName;

                    $(".sheet-rename-modal").remove();

                })
            })

            $(".sheet-delete").click(function () {
                if (Object.keys(cellData).length > 1) {
                    let currSheetName = selectedSheet;
                    let currSheet = $(".sheet-tab.selected")
                    let currSheetIndex = Object.keys(cellData).indexOf(selectedSheet);
                    if (currSheetIndex == 0) {
                        $(".sheet-tab.selected").next().click();
                    } else {
                        $(".sheet-tab.selected").prev().click();
                    }


                    delete cellData[currSheetName];
                    currSheet.remove();

                } else {
                    alert("sorry, there is one sheet only");
                }
            })
        }
        $(".sheet-options-modal").css("left", e.pageX + "px");
    })


};

$(".container").click(function () {
    $(".sheet-options-modal").remove();
})

addSheetEvents();

function selectSheet(ele) {
    $(".sheet-tab.selected").removeClass("selected");
    $(ele).addClass("selected");
    emptySheet();
    selectedSheet = $(ele).text();
    loadSheet();
}

let selectedCells = [];
let cut = false;

$(".icon-copy").click(function () {
    $(".input-cell.selected").each(function () {
        // let [rowId, colId ] = getRowCol(this);
        selectedCells.push(getRowCol(this));
    })
});

$(".icon-cut").click(function () {
    $(".input-cell.selected").each(function () {
        // let [rowId, colId ] = getRowCol(this);
        selectedCells.push(getRowCol(this));
    })
    cut = true;
});

$(".icon-paste").click(function () {
    emptySheet();

    let [rowId, colId] = getRowCol($(".input-cell.selected")[0]);
    let rowDistance = rowId - selectedCells[0][0];
    let colDistance = colId - selectedCells[0][1];

    for (let cell of selectedCells) {
        let newRowId = cell[0] + rowDistance;
        let newColId = cell[1] + colDistance;

        if (!cellData[selectedSheet][newRowId]) {
            cellData[selectedSheet][newRowId] = {};
        }
        cellData[selectedSheet][newRowId][newColId] = { ...cellData[selectedSheet][cell[0]][cell[1]] }
        if (cut) {
            delete cellData[selectedSheet][cell[0]][cell[1]];
            if (Object.keys(cellData[selectedSheet][cell[0]]).length == 0) {
                delete cellData[selectedSheet][cell[0]];
            }
        }
    }
    if (cut) {
        cut = false;
        selectedCells = [];
    }
    loadSheet();
});



// new


$(".menu-file").click(function (e) {
    let fileModal = $(`<div class="file-modal">
                        <div class="file-options-modal">
                            <div class="close">
                                <div class="material-icons close-icon">arrow_circle_down</div>
                                <div>Close</div>
                            </div>
                            <div class="new">
                                <div class="material-icons new-icon">insert_drive_file</div>
                                <div>New</div>
                            </div>
                            <div class="open">
                                <div class="material-icons open-icon">folder_open</div>
                                <div>Open</div>
                            </div>
                            <div class="save">
                                <div class="material-icons save-icon">save</div>
                                <div>Save</div>
                            </div>
                        </div>
                        <div class="file-recent-modal"></div>
                        <div class="file-transparent"></div>
                    </div>`);
    $(".container").append(fileModal);
    fileModal.animate({
        width: "100vw"
    }, 300);
    $(".close,.file-transparent,.new,.save,.open").click(function (e) {
        fileModal.animate({
            width: "0vw"
        }, 300);
        setTimeout(() => {
            fileModal.remove();
        }, 250);
    });
    $(".new").click(function (e) {
        if (save) {
            newFile();
        } else {
            $(".container").append(`<div class="sheet-modal-parent">
                                        <div class="sheet-delete-modal">
                                            <div class="sheet-modal-title">${$(".title").text()}</div>
                                            <div class="sheet-modal-detail-container">
                                                <span class="sheet-modal-detail-title">Do you want to save changes?</span>
                                            </div>
                                            <div class="sheet-modal-confirmation">
                                                <div class="button yes-button">
                                                    Yes
                                                </div>
                                                <div class="button no-button">No</div>
                                            </div>
                                        </div>
                                    </div>`);
            $(".no-button").click(function (e) {
                $(".sheet-modal-parent").remove();
                newFile();
            });
            $(".yes-button").click(function (e) {
                $(".sheet-modal-parent").remove();
                saveFile(true);
            });
        }
    });
    $(".save").click(function (e) {
        if (!save) {
            saveFile();
        }
    });

    $(".open").click(function (e) {
        openFile();
    })

});

function newFile() {
    emptySheet();
    cellData = { "Sheet1": {} };
    $(".sheet-tab").remove();
    $(".sheet-tab-container").append(`<div class="sheet-tab selected">Sheet1</div>`);
    addSheetEvents();
    selectedSheet = "Sheet1";
    totalSheets = 1;
    lastlyAddedSheet = 1;
    $(".title").text("Excel - Book");
    $("#row-1-col-1").click();
}

function saveFile(newClicked) {
    $(".container").append(`<div class="sheet-modal-parent">
                                <div class="sheet-rename-modal">
                                    <div class="sheet-modal-title">Save File</div>
                                    <div class="sheet-modal-input-container">
                                        <span class="sheet-modal-input-title">File Name:</span>
                                        <input class="sheet-modal-input" value="${$(".title").text()}" type="text" />
                                    </div>
                                    <div class="sheet-modal-confirmation">
                                        <div class="button yes-button">Save</div>
                                        <div class="button no-button">Cancel</div>
                                    </div>
                                </div>
                            </div>`);
    $(".yes-button").click(function (e) {
        $(".title").text($(".sheet-modal-input").val());
        let a = document.createElement("a");
        a.href = `data:application/json,${encodeURIComponent(JSON.stringify(cellData))}`;
        a.download = $(".title").text() + ".json";
        $(".container").append(a);
        a.click();
        // a.remove();
        save = true;

    });
    $(".no-button,.yes-button").click(function (e) {
        $(".sheet-modal-parent").remove();
        if (newClicked) {
            newFile();
        }
    });
}

function openFile() {
    let inputFile = $(`<input accept="application/json" type="file" />`);
    $(".container").append(inputFile);
    inputFile.click();
    inputFile.change(function (e) {
        console.log(inputFile.val());
        let file = e.target.files[0];
        $(".title").text(file.name.split(".json")[0]);
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            emptySheet();
            $(".sheet-tab").remove();
            cellData = JSON.parse(reader.result);
            let sheets = Object.keys(cellData);
            lastlyAddedSheet = 1;
            for (let i of sheets) {
                if (i.includes("Sheet")) {
                    let splittedSheetArray = i.split("Sheet");
                    if (splittedSheetArray.length == 2 && !isNaN(splittedSheetArray[1])) {
                        lastlyAddedSheet = parseInt(splittedSheetArray[1]);
                    }
                }
                $(".sheet-tab-container").append(`<div class="sheet-tab selected">${i}</div>`);
            }
            addSheetEvents();
            $(".sheet-tab").removeClass("selected");
            $($(".sheet-tab")[0]).addClass("selected");
            selectedSheet = sheets[0];
            totalSheets = sheets.length;
            loadCurrentSheet();
            inputFile.remove();
        }
    });
}

let clipboard = { startCell: [], cellData: {} };
let contentCutted = false;
$("#cut,#copy").click(function (e) {
    if ($(this).text() == "content_cut") {
        contentCutted = true;
    }
    clipboard = { startCell: [], cellData: {} };
    clipboard.startCell = getRowCol($(".input-cell.selected")[0]);
    $(".input-cell.selected").each(function (index, data) {
        let [rowId, colId] = getRowCol(data);
        if (cellData[selectedSheet][rowId - 1] && cellData[selectedSheet][rowId - 1][colId - 1]) {
            if (!clipboard.cellData[rowId]) {
                clipboard.cellData[rowId] = {};
            }
            clipboard.cellData[rowId][colId] = { ...cellData[selectedSheet][rowId - 1][colId - 1] };
        }
    });
    console.log(clipboard);
});

$("#paste").click(function (e) {
    if (contentCutted) {
        emptySheet();
    }
    let startCell = getRowCol($(".input-cell.selected")[0]);
    let rows = Object.keys(clipboard.cellData);
    for (let i of rows) {
        let cols = Object.keys(clipboard.cellData[i]);
        for (let j of cols) {
            if (contentCutted) {
                delete cellData[selectedSheet][i - 1][j - 1];
                if (Object.keys(cellData[selectedSheet][i - 1]).length == 0) {
                    delete cellData[selectedSheet][i - 1];
                }
            }

        }
    }
    for (let i of rows) {
        let cols = Object.keys(clipboard.cellData[i]);
        for (let j of cols) {
            let rowDistance = parseInt(i) - parseInt(clipboard.startCell[0]);
            let colDistance = parseInt(j) - parseInt(clipboard.startCell[1]);
            if (!cellData[selectedSheet][startCell[0] + rowDistance - 1]) {
                cellData[selectedSheet][startCell[0] + rowDistance - 1] = {};
            }
            cellData[selectedSheet][startCell[0] + rowDistance - 1][startCell[1] + colDistance - 1] = { ...clipboard.cellData[i][j] };
        }
    }
    loadCurrentSheet();
    if (contentCutted) {
        contentCutted = false;
        clipboard = { startCell: [], cellData: {} };
    }
});

$("#formula-input").blur(function (e) {
    if ($(".input-cell.selected").length > 0) {
        let formula = $(this).text();
        let tempElements = formula.split(" ");
        let elements = [];
        for (let i of tempElements) {
            if (i.length >= 2) {
                i = i.replace("(", "");
                i = i.replace(")", "");
                if (!elements.includes(i)) {
                    elements.push(i);
                }
            }
        }
        $(".input-cell.selected").each(function (index, data) {
            if (updateStreams(data, elements, false)) {
                let [rowId, colId] = getRowCol(data);
                cellData[selectedSheet][rowId - 1][colId - 1].formula = formula;
                let selfColCode = $(`.column-${colId}`).attr("id");
                evalFormula(selfColCode + rowId);
            } else {
                alert("Formula is not valid");
            }
        })
    } else {
        alert("!Please select a cell First");
    }
});

function updateStreams(ele, elements, update, oldUpstream) {
    let [rowId, colId] = getRowCol(ele);
    let selfColCode = $(`.column-${colId}`).attr("id");
    if (elements.includes(selfColCode + rowId)) {
        return false;
    }
    if (cellData[selectedSheet][rowId - 1] && cellData[selectedSheet][rowId - 1][colId - 1]) {
        let downStream = cellData[selectedSheet][rowId - 1][colId - 1].downStream;
        let upStream = cellData[selectedSheet][rowId - 1][colId - 1].upStream;
        for (let i of downStream) {
            if (elements.includes(i)) {
                return false;
            }
        }
        for (let i of downStream) {
            let [calRowId, calColId] = codeToValue(i);
            console.log(updateStreams($(`#row-${calRowId}-col-${calColId}`)[0], elements, true, upStream));
        }
    }

    if (!cellData[selectedSheet][rowId - 1]) {
        cellData[selectedSheet][rowId - 1] = {};
        cellData[selectedSheet][rowId - 1][colId - 1] = { ...defaultProperties, "upStream": [...elements], "downStream": [] };
    } else if (!cellData[selectedSheet][rowId - 1][colId - 1]) {
        cellData[selectedSheet][rowId - 1][colId - 1] = { ...defaultProperties, "upStream": [...elements], "downStream": [] };
    } else {

        let upStream = [...cellData[selectedSheet][rowId - 1][colId - 1].upStream];
        if (update) {
            for (let i of oldUpstream) {
                let [calRowId, calColId] = codeToValue(i);
                let index = cellData[selectedSheet][calRowId - 1][calColId - 1].downStream.indexOf(selfColCode + rowId);
                cellData[selectedSheet][calRowId - 1][calColId - 1].downStream.splice(index, 1);
                if (JSON.stringify(cellData[selectedSheet][calRowId - 1][calColId - 1]) == JSON.stringify(defaultProperties)) {
                    delete cellData[selectedSheet][calRowId - 1][calColId - 1];
                    if (Object.keys(cellData[selectedSheet][calRowId - 1]).length == 0) {
                        delete cellData[selectedSheet][calRowId - 1];
                    }
                }
                index = cellData[selectedSheet][rowId - 1][colId - 1].upStream.indexOf(i);
                cellData[selectedSheet][rowId - 1][colId - 1].upStream.splice(index, 1);
            }
            for (let i of elements) {
                cellData[selectedSheet][rowId - 1][colId - 1].upStream.push(i);
            }
        } else {
            for (let i of upStream) {
                let [calRowId, calColId] = codeToValue(i);
                let index = cellData[selectedSheet][calRowId - 1][calColId - 1].downStream.indexOf(selfColCode + rowId);
                cellData[selectedSheet][calRowId - 1][calColId - 1].downStream.splice(index, 1);
                if (JSON.stringify(cellData[selectedSheet][calRowId - 1][calColId - 1]) == JSON.stringify(defaultProperties)) {
                    delete cellData[selectedSheet][calRowId - 1][calColId - 1];
                    if (Object.keys(cellData[selectedSheet][calRowId - 1]).length == 0) {
                        delete cellData[selectedSheet][calRowId - 1];
                    }
                }
            }
            cellData[selectedSheet][rowId - 1][colId - 1].upStream = [...elements];
        }
    }

    for (let i of elements) {
        let [calRowId, calColId] = codeToValue(i);
        if (!cellData[selectedSheet][calRowId - 1]) {
            cellData[selectedSheet][calRowId - 1] = {};
            cellData[selectedSheet][calRowId - 1][calColId - 1] = { ...defaultProperties, "upStream": [], "downStream": [selfColCode + rowId] };
        } else if (!cellData[selectedSheet][calRowId - 1][calColId - 1]) {
            cellData[selectedSheet][calRowId - 1][calColId - 1] = { ...defaultProperties, "upStream": [], "downStream": [selfColCode + rowId] };
        } else {
            cellData[selectedSheet][calRowId - 1][calColId - 1].downStream.push(selfColCode + rowId);
        }
    }
    console.log(cellData);
    return true;

}

function codeToValue(code) {
    let colCode = "";
    let rowCode = "";
    for (let i = 0; i < code.length; i++) {
        if (!isNaN(code.charAt(i))) {
            rowCode += code.charAt(i);
        } else {
            colCode += code.charAt(i);
        }
    }
    let colId = parseInt($(`#${colCode}`).attr("class").split(" ")[1].split("-")[1]);
    let rowId = parseInt(rowCode);
    return [rowId, colId];
}

function evalFormula(cell) {
    let [rowId, colId] = codeToValue(cell);
    let formula = cellData[selectedSheet][rowId - 1][colId - 1].formula;
    console.log(formula);
    if (formula != "") {
        let upStream = cellData[selectedSheet][rowId - 1][colId - 1].upStream;
        let upStreamValue = [];
        for (let i in upStream) {
            let [calRowId, calColId] = codeToValue(upStream[i]);
            let value;
            if (cellData[selectedSheet][calRowId - 1][calColId - 1].text == "") {
                value = "0";
            }
            else {
                value = cellData[selectedSheet][calRowId - 1][calColId - 1].text;
            }
            upStreamValue.push(value);
            console.log(upStreamValue);
            formula = formula.replace(upStream[i], upStreamValue[i]);
        }
        cellData[selectedSheet][rowId - 1][colId - 1].text = eval(formula);
        loadCurrentSheet();
    }
    let downStream = cellData[selectedSheet][rowId - 1][colId - 1].downStream;
    for (let i = downStream.length - 1; i >= 0; i--) {
        evalFormula(downStream[i]);
    }

}
