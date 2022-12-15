define([
    'base/js/namespace',
    'base/js/events',
    'services/config',
    'base/js/utils',
    'notebook/js/codecell'
], function (Jupyter, events, codecell) {
    var run_list = []; /* list of cells to be run */
    select_mode = true;

    num_groups = 1;

    icon_list = ["fa-bus", "fa-subway", "fa-truck",
        "fa-car", "fa-bicycle", "fa-plane",
        "fa-motorcycle", "fa-ship", "fa-rocket"];

    mode = "fa-bus"; // initial mode

    change_group_mode_list = []

    group_to_color_dict = {
        "fa-bus": "green",
        "fa-subway": "blue",
        "fa-truck": "red",
        "fa-car": "brown",
        "fa-bicycle": "yellow",
        "fa-plane": "orange",
        "fa-motorcycle": "purple",
        "fa-ship": "pink",
        "fa-rocket": "cyan"
    }

    var run_all = function _execute_without_selecting() {
        // notebook.execute_cells alters selection, this doesn't
        var cells = Jupyter.notebook.get_cells();
        idx_start = 0;
        idx_end = cells.length;
        for (var ii = idx_start; ii < idx_end; ii++) {
            cells[ii].execute(false);
        }
    }


    var add_to_list = function __execute_with_selection() {
        run_list.push(Jupyter.notebook.get_selected_index());
        console.log('added');
    }
    // var run_list_fun = function __execute_with_selection2() {
    //   var cells = Jupyter.notebook.get_cells();
    //   for (var ii = 0; ii < run_list.length; ii++) {
    //     cells[run_list[ii]].execute(false);
    //   }
    // }


    //incorporating checkboxes
    var run_list_fun = function __execute_with_selection2() {
        var cells = Jupyter.notebook.get_cells();
        for (var ii = 0; ii < cells.length; ii++) {
            //logic if the cell is checked yet
            console.log("GOT HERE");
            console.log(cells[ii].metadata.checked);
            // console.log(cells[ii].metadata.trusted);
            if (cells[ii].metadata.checked) {
                console.log("Check is true");
                console.log("Cell Number: " + ii);
                cells[ii].execute(false);
            }
        }
    }

    var show_checkboxes = function () {
        console.log(select_mode)
        if (select_mode) {
            Jupyter.CellToolbar.activate_preset('Show Select Mode');
        } else {
            Jupyter.CellToolbar.activate_preset('Raw Cell Format');
        }
        select_mode = !select_mode;
    };


    var add_group = function () {
        num_groups = num_groups + 1;
        const group_num = num_groups - 1;

        Jupyter.toolbar.add_buttons_group([
            Jupyter.keyboard_manager.actions.register(
                // action  
                {
                    'help': 'Add to ' + icon_list[group_num] + ' group',
                    'icon': icon_list[group_num],
                    'handler': function () { }
                },
                // action name
                'planetjupyter' + group_num,
                // prefix
                'Planet Jupyter' + group_num)
        ], id = group_num.toString())

        //console.log(document.getElementById(group_num.toString()).childNodes[0]);

        // Add onclick function for each group
        document.getElementById(group_num.toString()).childNodes[0].onclick = function () {
            console.log(group_num.toString() + " clicked")
            mode = icon_list[group_num];
            console.log('mode' + " " + icon_list[group_num])

            for (var i = 0; i < num_groups; i++) {
                if (i == group_num) {
                    document.getElementById(i.toString()).childNodes[0].style.color = group_to_color_dict[mode]
                }
                else {
                    document.getElementById(i.toString()).childNodes[0].style.color = "black"
                }
            }
        };
    };


    // Add Toolbar buttons
    var add_toolbar_buttons = function () {
        console.log();

        // Button for play all
        Jupyter.toolbar.add_buttons_group([
            Jupyter.keyboard_manager.actions.register({
                'help': 'Run all cells',
                'icon': 'fa-play-circle',
                'handler': run_all
            }, 'planetjupyter-run_all', 'Planet Jupyter')
        ])

        // Button for run selected
        Jupyter.toolbar.add_buttons_group([
            Jupyter.keyboard_manager.actions.register({
                'help': 'Run selected cells',
                'icon': 'fa-step-forward',
                'handler': run_list_fun
            }, 'planetjupyter-run_list_fun', 'Planet Jupyter')
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


        // Button for Default first group
        group_num = num_groups - 1;
        Jupyter.toolbar.add_buttons_group([
            Jupyter.keyboard_manager.actions.register({
                'help': 'Add to ' + icon_list[group_num] + ' group',
                'icon': icon_list[group_num],
                'handler': function () { } // place holder
            }, 'go to group0', 'Planet Jupyter')
        ], id = (group_num).toString())

        // Add onclick function to first default group
        document.getElementById(group_num.toString()).childNodes[0].onclick = function () {
            console.log(group_num.toString() + " clicked")
            mode = icon_list[group_num];
            console.log('mode' + " " + icon_list[group_num])

            for (var i = 0; i < num_groups; i++) {
                if (i == group_num) {
                    document.getElementById(i.toString()).childNodes[0].style.color = group_to_color_dict[mode]
                }
                else {
                    document.getElementById(i.toString()).childNodes[0].style.color = "black"
                }
            }
        };
    }

    // Add Checkbox to each cell
    var register_cellbar_select_mode = function () {
        console.log("add select mode presets");

        var CellToolbar = Jupyter.CellToolbar
        Jupyter.CellToolbar.register_preset('Show Select Mode', ['select_mode'])

        var addcheckBox = function (div, cell) {
            var button_container = $(div)
            var checkbox = $('<input/>').attr('type', 'checkbox');

            checkbox.click(function () {
                var value = checkbox.prop('checked');
                cell.metadata.checked = value;

                // Change color when click??
                var checkboxDiv = $(checkbox).parent();

                var color = group_to_color_dict[mode]
                if (value) {
                    checkboxDiv.css('background-color', color);
                } else {
                    checkboxDiv.css('background-color', "#EEEEEE");
                }
                console.log(cell.metadata.checked);
            })

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

        // Default mode to show the checkboxes
        // TODO: reformat the checkboxes
        show_checkboxes();
    }
    return {
        load_ipython_extension: load_ipython_extension
    };


});
