define([
    'base/js/namespace',
    'base/js/events',
    'services/config',
    'base/js/utils',
    'notebook/js/codecell'
], function (Jupyter, events, codecell) {

    select_mode = true;

    var list_of_run_lists = []; /* list of cells to be run */


    for (var ii = 0; ii < 9; ii++) {
        empty_list = [];
        list_of_run_lists.push(empty_list);
    }

    num_groups = 0;

    icon_list = ["fa-bus", "fa-subway", "fa-truck",
        "fa-car", "fa-bicycle", "fa-plane",
        "fa-motorcycle", "fa-ship", "fa-rocket"];

    mode = "fa-bus"; // initial mode

    group_to_color_dict = {
        "fa-bus": "green",
        "fa-subway": "blue",
        "fa-truck": "pink",
        "fa-car": "cyan",
        "fa-bicycle": "yellow",
        "fa-plane": "orange",
        "fa-motorcycle": "purple",
        "fa-ship": "red",
        "fa-rocket": "brown"
    }

    group_to_color_index = {
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
        var mode_index = group_to_color_index[mode]
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
        num_groups = num_groups + 1;
        const group_num = num_groups - 1;

        // Add Button for the group
        Jupyter.toolbar.add_buttons_group([
            Jupyter.keyboard_manager.actions.register(
                // action  
                {
                    'help': 'Add to ' + icon_list[group_num] + ' group',
                    'icon': icon_list[group_num],
                    'handler': function () { } // placeholder
                },
                // action name
                'planetjupyter' + group_num,
                // prefix
                'Planet Jupyter' + group_num)
        ], id = group_num.toString()) // add id to the button group

        // console.log(document.getElementById(group_num.toString()).childNodes[0]);
        // Add OnClick function for the button
        add_group_button_click_function(group_num);
    };

    var add_group_button_click_function = function (group_num) {
        document.getElementById(group_num.toString()).childNodes[0].onclick = function () {
            mode = icon_list[group_num];
            mode_index = group_to_color_index[mode]

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
                cellDiv.style = "background-color: " + group_to_color_dict[mode] + ";"
                checkboxElement.checked = true;
                checkboxElement.style = "accent-color: " + group_to_color_dict[mode];
            }
            else {
                cellDiv.style = "background-color: " + "white" + ";"
                checkboxElement.checked = false
                checkboxElement.style = "accent-color: " + "#EEEEEE"
            }
        }
    }

    var update_sequence_num = function () {

        mode_index = group_to_color_index[mode]
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
        console.log();

        // Button for play all
        Jupyter.toolbar.add_buttons_group([
            Jupyter.keyboard_manager.actions.register({
                'help': 'Run all cells',
                'icon': 'fa-play-circle',
                'handler': run_current_group
            }, 'planetjupyter-run_all', 'Planet Jupyter')
        ])

        // Button for show checkboxes
        Jupyter.toolbar.add_buttons_group([
            Jupyter.keyboard_manager.actions.register({
                'help': 'Show Select Mode',
                'icon': 'fa-check-square-o',
                'handler': show_checkboxes
            },
                'show-select-mode', 'Planet Jupyter')
        ])

        // Button for add a new group
        Jupyter.toolbar.add_buttons_group([
            Jupyter.keyboard_manager.actions.register({
                'help': 'Add planet jupyter cell',
                'icon': 'fa-plus',
                'handler': add_group
            }, 'planetjupyter-plus_cells_to_list', 'Planet Jupyter')
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
                cellDiv.style = "background-color: " + "white" + ";"
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

            var checkbox = $('<input/>').attr('type', 'checkbox');
            var sequence_span = $('<span/>').text('');

            // Add checkbox to click function
            checkbox.click(function () {
                var value = checkbox.prop('checked');
                cell.metadata.checked = value;
                var mode_index = group_to_color_index[mode]

                var color = group_to_color_dict[mode]

                console.log(cell.cell_type)
                cellDiv = button_container.parent().parent().parent().parent().parent()
                if (cell.cell_type != "code") {
                    cellDiv = button_container.parent().parent().parent().parent()
                }

                // If checked, add the current cell to run list under this mode
                if (value) {
                    // Highlight the whole cell
                    cellDiv.css({ "background-color": color });

                    // Highlight the checkbox
                    checkbox.css('accent-color', color);

                    // Add the cell to run list under this mode
                    list_of_run_lists[mode_index].push(cell);
                }
                // Delete this cell from run list under this mode
                else {
                    cellDiv.css({ "background-color": "white" });
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
    // 2. improve design
    // 3. refactor code


});