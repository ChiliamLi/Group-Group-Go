define([
    'base/js/namespace',
    'base/js/events',
    'services/config',
    'base/js/utils',
    'notebook/js/codecell'
], function (Jupyter, events, codecell) {

    select_mode = true;

    background_opacity = 30 // 30% opacity

    num_groups = 0; // total number of groups

    var list_of_run_lists = []; /* list of cells to be run */
    for (var ii = 0; ii < 9; ii++) {
        empty_list = [];
        list_of_run_lists.push(empty_list);
    }

    icon_list = ["fa-bus", "fa-subway", "fa-truck",
        "fa-car", "fa-bicycle", "fa-plane",
        "fa-motorcycle", "fa-ship", "fa-rocket"];

    mode = "fa-bus"; // initial mode

    group_to_color_dict = {
        "fa-bus": "#e3342f", // red
        "fa-subway": "#f6993f", // orange
        "fa-truck": "#ffed4a", // yellow
        "fa-car": "#38c172", // green
        "fa-bicycle": "#4dc0b5", // teal
        "fa-plane": "#3490dc", // blue
        "fa-motorcycle": "#6574cd", // indigo
        "fa-ship": "#9561e2", // purple
        "fa-rocket": "#f66d9b" // pink
    }

    group_to_color_dict = {
        "fa-bus": "#e3342f", // red
        "fa-subway": "#f6993f", // orange
        "fa-truck": "#ffed4a", // yellow
        "fa-car": "#38c172", // green
        "fa-bicycle": "#4dc0b5", // teal
        "fa-plane": "#3490dc", // blue
        "fa-motorcycle": "#6574cd", // indigo
        "fa-ship": "#9561e2", // purple
        "fa-rocket": "#f66d9b" // pink
    }

    group_to_mode_index = {
        "fa-bus": "0",
        "fa-subway": "1",
        "fa-truck": "2",
        "fa-car": "3",
        "fa-bicycle": "4",
        "fa-plane": "5",
        "fa-motorcycle": "6",
        "fa-ship": "7",
        "fa-rocket": "8"
    }

    var run_current_group = function __execute_with_selection3() {
        console.log("RUN CURRENT GROUP in mode " + mode);
        var mode_index = group_to_mode_index[mode]
        // Get cells to run in the current group
        var cells = list_of_run_lists[mode_index];

        for (var ii = 0; ii < cells.length; ii++) {
            cells[ii].execute(false);
        }
    }

    var delete_from_run_list = function (mode_index, cell) {

        cell_id = cell.cell_id;
        console.log(cell_id);
        index = 0;

        for (var ii = 0; ii < list_of_run_lists[mode_index].length; ii++) {
            if (list_of_run_lists[mode_index][ii].cell_id == cell_id) {
                index = ii;
                break;
            }
        }

        if (index > -1) { // only splice array when item is found
            list_of_run_lists[mode_index].splice(index, 1); // 2nd parameter means remove one item only
        }
    }


    var add_group = function () {
        if (num_groups < 9) {
            num_groups = num_groups + 1;
            const group_num = num_groups - 1;

            // Add Button for the group
            Jupyter.toolbar.add_buttons_group([
                Jupyter.keyboard_manager.actions.register(
                    // action  
                    {
                        'help': 'Group' + (group_num + 1).toString(),
                        'icon': icon_list[group_num],
                        'handler': function () { } // placeholder
                    },
                    // action name
                    'go-to-group' + group_num,
                    // prefix
                    'Group Group Go')
            ], id = group_num.toString()) // add id to the button group

            // console.log(document.getElementById(group_num.toString()).childNodes[0]);
            // Add OnClick function for the button
            add_group_button_click_function(group_num);
        }
    };

    var add_group_button_click_function = function (group_num) {
        document.getElementById(group_num.toString()).childNodes[0].onclick = function () {
            mode = icon_list[group_num];
            mode_index = group_to_mode_index[mode]

            console.log('mode' + " " + icon_list[group_num])
            console.log(group_num.toString() + " clicked")


            highlight_current_group_icon(group_num);

            highlight_current_group_checkbox();

            update_sequence_num(mode_index);
        };
    }


    var highlight_current_group_icon = function (group_num) {
        for (var i = 0; i < num_groups; i++) {
            if (i == group_num) {
                document.getElementById(i.toString()).childNodes[0].style.color = group_to_color_dict[mode]
            }
            else {
                document.getElementById(i.toString()).childNodes[0].style.color = "black"
            }
        }
    }

    var highlight_current_group_checkbox = function () {
        current_run_list_cell_ids = list_of_run_lists[mode_index].map(a => a.cell_id)
        console.log("current_run_list_cell_ids")
        console.log(current_run_list_cell_ids)

        all_cells = Jupyter.notebook.get_cells()
        for (var i = 0; i < all_cells.length; i++) {

            current_cell = all_cells[i]

            cellDiv = current_cell.element[0]
            // console.log(cellDiv)
            // Default innerCell Div
            innerCellDiv = cellDiv.childNodes[0].childNodes[1]
            // if it is markdown cell(they have different html structure)
            if (current_cell.cell_type != "code") {
                innerCellDiv = current_cell.element[0].childNodes[1]
            }
            // console.log(innerCellDiv)

            button_container = innerCellDiv.childNodes[0].childNodes[0].childNodes[0]
            // console.log(button_container)

            checkboxElement = button_container.childNodes[1]
            // console.log(checkboxElement);

            // If the cell is in the current group
            if (current_run_list_cell_ids.includes(current_cell.cell_id)) {
                // highlight the whole cell
                cellDiv.style = "background-color: " + group_to_color_dict[mode] + background_opacity + ";"

                // highlight the checkbox
                checkboxElement.checked = true;
                checkboxElement.style = "accent-color: " + group_to_color_dict[mode];
            }
            else {
                cellDiv.style = "background-color: " + "#FFFFFF" + ";"
                checkboxElement.checked = false
                checkboxElement.style = "accent-color: " + "#EEEEEE"
            }
        }
    }

    var update_sequence_num = function () {

        mode_index = group_to_mode_index[mode]
        current_run_list_cell_ids = list_of_run_lists[mode_index].map(a => a.cell_id)
        console.log("current_run_list_cell_ids")
        console.log(current_run_list_cell_ids)

        all_cells = Jupyter.notebook.get_cells()
        for (var i = 0; i < all_cells.length; i++) {
            current_cell = all_cells[i]

            // Default innerCell Div
            innerCellDiv = current_cell.element[0].childNodes[0].childNodes[1]

            // if it is markdown cell(they have different html structure)
            if (current_cell.cell_type != "code") {
                innerCellDiv = current_cell.element[0].childNodes[1]
            }
            button_container = innerCellDiv.childNodes[0].childNodes[0].childNodes[0]

            // console.log(button_container)

            spanSequence = button_container.childNodes[0]
            // console.log(spanSequence);
            checkboxElement = button_container.childNodes[1]
            // console.log(checkboxElement);
            if (current_run_list_cell_ids.includes(current_cell.cell_id)) {
                spanSequence.textContent = current_run_list_cell_ids.indexOf(current_cell.cell_id) + 1
            }
            else {
                spanSequence.textContent = ""
            }
        }
    }


    // Add Toolbar buttons
    var add_toolbar_buttons = function () {

        // Button for show checkboxes
        Jupyter.toolbar.add_buttons_group([
            Jupyter.keyboard_manager.actions.register({
                'help': 'Show Select Mode',
                'icon': 'fa-check-square-o',
                'handler': show_checkboxes
            },
                'show-select-mode', 'Group Group Go')
        ])

        // Button for run current group
        Jupyter.toolbar.add_buttons_group([
            Jupyter.keyboard_manager.actions.register({
                'help': 'Run Cells in Group',
                'icon': 'fa-play-circle',
                'handler': run_current_group
            }, 'run-cell-in-group', 'Group Group Go')
        ])

        // Button for add a new group
        Jupyter.toolbar.add_buttons_group([
            Jupyter.keyboard_manager.actions.register({
                'help': 'Add New Group',
                'icon': 'fa-plus',
                'handler': add_group
            }, 'add-new-group', 'Group Group Go')
        ])
    }


    var show_checkboxes = function () {
        console.log(select_mode)
        if (select_mode) {
            Jupyter.CellToolbar.activate_preset('Show Select Mode');
        } else {
            // Reset
            Jupyter.CellToolbar.activate_preset('Raw Cell Format');
            list_of_run_lists = []
            for (var ii = 0; ii < 9; ii++) {
                empty_list = [];
                list_of_run_lists.push(empty_list);
            }
            mode = "fa-bus";

            // remove all cell highlights
            all_cells = Jupyter.notebook.get_cells()
            for (var i = 0; i < all_cells.length; i++) {
                current_cell = all_cells[i]
                cellDiv = current_cell.element[0]
                cellDiv.style = "background-color: " + "#FFFFFF" + ";" //white
            }

        }
        select_mode = !select_mode;
    };


    // Add checkbox and sequence to each cell
    var register_cellbar_select_mode = function () {
        console.log("add select mode presets");

        var CellToolbar = Jupyter.CellToolbar
        Jupyter.CellToolbar.register_preset('Show Select Mode', ['select_mode'])

        var addcheckBox = function (div, cell) {
            var button_container = $(div)
            button_container.attr("style",
                "display: flex;"
            )

            var checkbox = $('<input/>').attr('type', 'checkbox');
            // checkbox design
            checkbox.attr("style",
                "width: 20px; height:20px; padding: auto; margin: auto;"
            )

            var sequence_span = $('<span/>').text('');
            // sequence design
            sequence_span.attr("style",
                "font-size: 16px; display: flex; justify-content: center; padding-right: 5px; padding-top: 3px"
            )


            // Add checkbox to click function
            checkbox.click(function () {
                var value = checkbox.prop('checked');
                cell.metadata.checked = value;
                var mode_index = group_to_mode_index[mode]

                var color = group_to_color_dict[mode]

                console.log(cell.cell_type)
                cellDiv = button_container.parent().parent().parent().parent().parent()
                if (cell.cell_type != "code") {
                    cellDiv = button_container.parent().parent().parent().parent()
                }

                // If checked, add the current cell to run list under this mode
                if (value) {
                    // Highlight the whole cell with opacity
                    //console.log(cellDiv[0])
                    background_color = color + background_opacity
                    cellDiv[0].style = "background-color: " + background_color + ";"

                    // Highlight the checkbox
                    checkbox.css('accent-color', color);

                    // Add the cell to run list under this mode
                    list_of_run_lists[mode_index].push(cell);
                }
                // Delete this cell from run list under this mode
                else {
                    cellDiv.css({ "background-color": "#FFFFFF " }); // White
                    checkbox.css('accent-color', "#EEEEEE");
                    delete_from_run_list(mode_index, cell);
                }

                cell.metadata.color = color;
                update_sequence_num(mode_index);
                console.log(cell.metadata.checked);
            })

            button_container.append(sequence_span);
            button_container.append(checkbox);
        }

        CellToolbar.register_callback('select_mode', addcheckBox);
    }



    // Loading the extension
    function load_ipython_extension() {
        // Add a default cell if there are no cells
        if (Jupyter.notebook.get_cells().length === 1) {
            insert_cell();
        }

        add_toolbar_buttons();
        register_cellbar_select_mode();

        // Add a default group and highlight the button
        add_group();
        highlight_current_group_icon(0)

        // Default mode to show the checkboxes
        show_checkboxes();
    }
    return {
        load_ipython_extension: load_ipython_extension
    };

    // TODO:
    // 1. Integrate 521 Codes


});