define([
    'base/js/namespace',
    'base/js/events',
    'services/config',
    'base/js/utils',
    'notebook/js/codecell',
    'jquery',
    'require'
], function (Jupyter, events, codecell) {

    var params = {
        show_checkboxes: 'Alt-e',
        add_group: 'Alt-a',
        run_current_group: 'Alt-r',
        name_group: 'Alt-n',
        add_current_cell_to_group: 'Alt-s',
        run_group_1: 'Alt-1',
        run_group_2: 'Alt-2',
        run_group_3: 'Alt-3',
        run_group_4: 'Alt-4',
        run_group_5: 'Alt-5',
        run_group_6: 'Alt-6',
        run_group_7: 'Alt-7',
        run_group_8: 'Alt-8',
        run_group_9: 'Alt-9'
    }

    select_mode = true;

    background_opacity = 30 // 30% opacity for cell highlight background

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
    mode_to_group_index = {
        "0": "fa-bus",
        "1": "fa-subway",
        "2": "fa-truck",
        "3": "fa-car",
        "4": "fa-bicycle",
        "5": "fa-plane",
        "6": "fa-motorcycle",
        "7": "fa-ship",
        "8": "fa-rocket"
    }

    var run_current_group = function __execute_with_selection3() {
        console.log("RUN CURRENT GROUP in mode " + mode);
        // document.getElementById('run-button'.toString()).childNodes[0].blur()
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
        // document.getElementById('add-button'.toString()).childNodes[0].blur()
        if (num_groups < 9) {
            num_groups = num_groups + 1;
            const group_num = num_groups - 1;

            // Add Button for the group
            Jupyter.toolbar.add_buttons_group([
                Jupyter.keyboard_manager.actions.register(
                    // action  
                    {
                        'help': 'Group' + (group_num + 1).toString() + ", Double Click to Deselect All",
                        'icon': 'fa-circle',
                        'handler': function () { } // placeholder,
                    },
                    // action name
                    'go-to-group' + group_num,
                    // prefix
                    'Group Group Go')
            ], id = group_num.toString()) // add id to the button group


            button = document.getElementById(group_num.toString()).childNodes[0];
            button.style.color = group_to_color_dict[mode_to_group_index[group_num]]
            // console.log(document.getElementById(group_num.toString()).childNodes[0]);
            // Add OnClick function for the button
            add_group_button_click_function(button, group_num);
        }
    };

    var clickGroup = function (group_num) {
        buttonDiv = button = document.getElementById((group_num - 1).toString())

        if (buttonDiv != null) {
            button = $(buttonDiv).find('button')[0]
            console.log(button)
            button.click()
        }
    }

    var add_group_button_click_function = function (button, group_num) {
        // button = document.getElementById(group_num.toString()).childNodes[0];

        button.onclick = function () {
            mode = icon_list[group_num];
            mode_index = group_to_mode_index[mode]

            console.log('mode' + " " + icon_list[group_num])
            console.log(group_num.toString() + " clicked")


            highlight_current_group_icon(group_num);

            highlight_current_group_checkbox();

            update_sequence_num(mode_index);
        };

        // Double click to deselect all cells
        button.ondblclick = function () {
            mode = icon_list[group_num];
            mode_index = group_to_mode_index[mode]
            list_of_run_lists[mode_index] = []
            highlight_current_group_checkbox();
            update_sequence_num(mode_index);
        }


    }


    var highlight_current_group_icon = function (group_num) {
        for (var i = 0; i < num_groups; i++) {
            if (i == group_num) {
                console.log(group_num)
                var dom = document.getElementById(i.toString()).childNodes[0]
                document.getElementById(i.toString()).childNodes[0].style.boxShadow = "inset 0px 10px 20px #c1c1c1";
                document.getElementById(i.toString()).childNodes[0].blur()
                document.getElementById(i.toString()).childNodes[0].style.color = group_to_color_dict[mode]
                // document.getElementById(i.toString()).childNodes[0].addClass('active').blur()
            }
            else {
                // document.getElementById(i.toString()).childNodes[0].style.color = group_to_color_dict[mode_to_group_index[i]]
                document.getElementById(i.toString()).childNodes[0].style.boxShadow = "none"
            }
        }
    }

    var highlight_current_group_checkbox = function () {
        current_run_list_cell_ids = list_of_run_lists[mode_index].map(a => a.cell_id)
        // console.log("current_run_list_cell_ids")
        // console.log(current_run_list_cell_ids)

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
                checkboxElement.style = "accent-color: " + group_to_color_dict[mode] + "; width: 20px; height:20px; padding: auto; margin: auto;"
            }
            else {
                cellDiv.style = "background-color: " + "#FFFFFF" + ";"
                checkboxElement.checked = false
                checkboxElement.style = "accent-color: " + "#EEEEEE" + "; width: 20px; height:20px; padding: auto; margin: auto;"
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

        // Button Group for show checkboxes, run current group, and add a group
        Jupyter.toolbar.add_buttons_group([
            // Button for show checkboxes
            Jupyter.keyboard_manager.actions.register({
                'help': 'Show Checkboxes (Option + E)',
                'icon': 'fa-check-circle',
                'handler': show_checkboxes
            },
                'show-select-mode', 'Group Group Go'),

            // Button for run current group
            Jupyter.keyboard_manager.actions.register({
                'help': 'Run Cells in Group (Option + R)',
                'icon': 'fa-play-circle',
                'handler': run_current_group
            }, 'run-cell-in-group', 'Group Group Go'),


            // Button for add a new group
            Jupyter.keyboard_manager.actions.register({
                'help': 'Add New Group (Option + A)',
                'icon': 'fa-plus-circle',
                'handler': add_group
            }, 'add-new-group', 'Group Group Go'),

            // Button for name a new group
            Jupyter.keyboard_manager.actions.register({
                'help': 'Name current Group (Option + N)',
                'icon': 'fa-arrow-circle-o-right',
                'handler': name_group
            }, 'name-a-group', 'Group Group Go')

        ], id = 'group_group_go'.toString())


        // Add Instructions
        var group_group_go_tool_bar = document.getElementById('group_group_go'.toString())
        group_group_go_tool_bar.childNodes[0].appendChild(document.createTextNode("  " + "On".toString()))
        group_group_go_tool_bar.childNodes[1].appendChild(document.createTextNode("  " + "Run Group".toString()))
        group_group_go_tool_bar.childNodes[2].appendChild(document.createTextNode("  " + "Add".toString()))
        group_group_go_tool_bar.childNodes[3].appendChild(document.createTextNode("  " + "Name".toString()))
    }

    var name_group = function () {
        var group_group_go_tool_bar = document.getElementById('group_group_go'.toString())
        button = group_group_go_tool_bar.childNodes[3]
        group_button = document.getElementById(group_to_mode_index[mode].toString()).childNodes[0]

        let name = prompt("Give a name to this group:", "");
        if (name != null) {
            if (group_button.childNodes.length > 1) {
                group_button.childNodes[1].textContent = " " + name
            }
            else {
                group_button.appendChild(document.createTextNode(" " + name));
            }

        }

    }


    var show_checkboxes = function () {

        if (select_mode) {
            Jupyter.CellToolbar.activate_preset('Show Select Mode');
            Jupyter.CellToolbar.global_show();

            // make the show button marked
            document.getElementById('group_group_go'.toString()).childNodes[0].style.boxShadow = "inset 0px 10px 20px #c1c1c1";
            document.getElementById('group_group_go'.toString()).childNodes[0].childNodes[1].textContent = " On"

            // mark the group button
            groupButton = document.getElementById(group_to_mode_index[mode].toString()).childNodes[0]
            groupButton.style.boxShadow = "inset 0px 10px 20px #c1c1c1";
            // highlight cells
            groupButton.click()


        } else {
            // Reset
            Jupyter.CellToolbar.activate_preset('Raw Cell Format');
            // list_of_run_lists = []
            // for (var ii = 0; ii < 9; ii++) {
            //     empty_list = [];
            //     list_of_run_lists.push(empty_list);
            // }
            mode = "fa-bus";

            // remove all cell highlights
            all_cells = Jupyter.notebook.get_cells()
            for (var i = 0; i < all_cells.length; i++) {
                current_cell = all_cells[i]
                cellDiv = current_cell.element[0]
                cellDiv.style = "background-color: " + "#FFFFFF" + ";" //white
            }

            // remove all names
            // for (var i = 0; i < num_groups; i++) {
            //     var dom = document.getElementById(i.toString()).childNodes[0]
            //     if (dom.childNodes.length > 1) {
            //         dom.removeChild(dom.childNodes[1])
            //     }
            // }

            // unmark the show button
            document.getElementById('group_group_go'.toString()).childNodes[0].style = "background-color: white;box-shadow: none;";
            document.getElementById('group_group_go'.toString()).childNodes[0].childNodes[1].textContent = " Off"

            // unmark the group button
            document.getElementById(group_to_mode_index[mode].toString()).childNodes[0].style = "color:" + group_to_color_dict[mode] + ";background-color: white;box-shadow: none;";
        }

        select_mode = !select_mode;
    };

    var select_current_cell = function () {
        // get the current cell
        var cellDiv = $(Jupyter.notebook.get_selected_cell().element[0])
        var checkbox;

        console.log(cellDiv)
        //get the current cell's div
        cellDiv.find(":checkbox").each(function (i, ob) {
            checkbox = ob
        });

        checkbox.click()
    }


    // Add checkbox and sequence to each cell
    var register_cellbar_select_mode = function () {
        // console.log("add select mode presets");

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
                "width: 20px; height:20px; padding: auto; margin: auto; border:none; outline:none;"
            )

            var sequence_span = $('<span/>').text('');
            // sequence design
            sequence_span.attr("style",
                "font-size: 16px; display: flex; justify-content: center; padding-right: 5px; padding-top: 3px"
            )

            var checkCurrentCell = function () {
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
                    // enlarge the checkbox
                    checkbox.attr("style",
                        "width: 20px; height:20px; outline:none; border:none" +
                        "padding: auto; margin: auto; accent-color:" + color + ";"
                    )

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
            }


            button_container.append(sequence_span);
            button_container.append(checkbox);

            // Add checkbox to click function
            checkbox.click(checkCurrentCell);
        }


        CellToolbar.register_callback('select_mode', addcheckBox);
    }


    /**
    * Add CSS file
    * @param name filename
    */
    var load_css = function (name) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = requirejs.toUrl(name);
        document.getElementsByTagName("head")[0].appendChild(link);
    };


    var initialize = function () {
        $.extend(true, params, Jupyter.notebook.config.data.group_group_go);

        add_toolbar_buttons();
        register_cellbar_select_mode();

        // Add a default group and highlight the button
        add_group();
        highlight_current_group_icon(0)

        // Default mode to show the checkboxes
        show_checkboxes();

        /* Add keyboard shortcuts */
        var add_command_shortcuts = {};
        add_command_shortcuts[params["show_checkboxes"]] = {
            help: 'Show Checkboxes',
            help_index: 'xe',
            handler: function () {
                show_checkboxes();
                return false;
            }
        };

        add_command_shortcuts[params["add_group"]] = {
            help: 'Add Group',
            help_index: 'xa',
            handler: function () {
                add_group();
                return false;
            }
        };

        add_command_shortcuts[params["run_current_group"]] = {
            help: 'Run Current Group',
            help_index: 'xr',
            handler: function () {
                run_current_group();
                return false;
            }
        };

        add_command_shortcuts[params["name_group"]] = {
            help: 'Name Current Group',
            help_index: 'xn',
            handler: function () {
                name_group();
                return false;
            }
        };

        add_command_shortcuts[params["add_current_cell_to_group"]] = {
            help: 'Add Cell To Group',
            help_index: 'xs',
            handler: function () {
                select_current_cell();
                return false;
            }
        };

        add_command_shortcuts[params["run_group_1"]] = {
            help: 'Run Group 1',
            help_index: 'x1',
            handler: function () {
                clickGroup(1);
                return false;
            }
        };

        add_command_shortcuts[params["run_group_2"]] = {
            help: 'Run Group 2',
            help_index: 'x2',
            handler: function () {
                clickGroup(2);
                return false;
            }
        };

        add_command_shortcuts[params["run_group_3"]] = {
            help: 'Run Group 3',
            help_index: 'x3',
            handler: function () {
                clickGroup(3);
                return false;
            }
        };

        add_command_shortcuts[params["run_group_4"]] = {
            help: 'Run Group 4',
            help_index: 'x4',
            handler: function () {
                clickGroup(4);
                return false;
            }
        };

        add_command_shortcuts[params["run_group_5"]] = {
            help: 'Run Group 5',

            help_index: 'x5',
            handler: function () {
                clickGroup(5);
                return false;
            }
        };

        add_command_shortcuts[params["run_group_6"]] = {
            help: 'Run Group 6',
            help_index: 'x6',
            handler: function () {
                clickGroup(6);

                return false;
            }
        };

        add_command_shortcuts[params["run_group_7"]] = {
            help: 'Run Group 7',
            help_index: 'x7',
            handler: function () {
                clickGroup(7);
                return false;
            }
        };

        add_command_shortcuts[params["run_group_8"]] = {
            help: 'Run Group 8',
            help_index: 'x8',
            handler: function () {
                clickGroup(8);
                return false;
            }
        };

        add_command_shortcuts[params["run_group_9"]] = {
            help: 'Run Group 9',
            help_index: 'x9',
            handler: function () {

                clickGroup(9);
                return false;
            }
        };


        Jupyter.keyboard_manager.command_shortcuts.add_shortcuts(add_command_shortcuts);
        Jupyter.keyboard_manager.edit_shortcuts.add_shortcuts(add_command_shortcuts);
    };


    // Loading the extension
    function load_ipython_extension() {
        load_css('./nbextensions/group_group_go/main.css');

        Jupyter.notebook.config.loaded.then(initialize);
    }
    return {
        load_ipython_extension: load_ipython_extension
    };
});

