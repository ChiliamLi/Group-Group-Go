define([ 
    'base/js/namespace',
    'base/js/events',
    'services/config',
    'base/js/utils',
    'notebook/js/codecell'
    ], function(Jupyter, events, codecell) {
    var run_list = []; /* list of cells to be run */

    // define default config parameter values
    // var params = {
    //     run_cells_above: 'Alt-a',
    //     run_cells_below: 'Alt-b',
    //     toggle_marker: 'Alt-t',
    //     mark_all_codecells: 'Alt-m',
    //     unmark_all_codecells: 'Alt-u',
    //     run_marked_cells: 'Alt-r',
    //     run_all_cells: 'Alt-x',
    //     run_all_cells_ignore_errors: 'Alt-f',
    //     stop_execution: 'Ctrl-c',
    //     marked_color: '#20f224',
    //     scheduled_color: '#00def0',
    //     run_color: '#f30a2d'
    // };
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
      var run_list_fun = function __execute_with_selection2() {
        var cells = Jupyter.notebook.get_cells();
        for (var ii = 0; ii < run_list.length; ii++) {
          cells[run_list[ii]].execute(false);
        }
      }
      var insert_cell = function() {
        Jupyter.notebook.
        insert_cell_above('code').
        set_text(`print('copy and pasted runtools1')`);
        Jupyter.notebook.select_prev();
        // Jupyter.notebook.execute_cell_and_select_below();
      };
      // Add Toolbar button
      var planetJupyterButton = function () {
          console.log();
          Jupyter.toolbar.add_buttons_group([
             Jupyter.keyboard_manager.actions.register ({
                'help': 'Add planet jupyter cell',
                'icon' : 'fa-edit',
                'handler': insert_cell
            }, 'addplanetjupyter-cell', 'Planet Jupyter')
          ])
          Jupyter.toolbar.add_buttons_group([
            Jupyter.keyboard_manager.actions.register ({
               'help': 'Add planet jupyter cell',
               'icon' : 'fa-play-circle',
               'handler': run_all
           }, 'planetjupyter-run_all', 'Planet Jupyter')
         ])
          Jupyter.toolbar.add_buttons_group([
            Jupyter.keyboard_manager.actions.register ({
              'help': 'Add planet jupyter cell',
              'icon' : 'fa-camera',
              'handler': run_list_fun
          }, 'planetjupyter-run_list_fun', 'Planet Jupyter')
        ])
        Jupyter.toolbar.add_buttons_group([
          Jupyter.keyboard_manager.actions.register ({
            'help': 'Add planet jupyter cell',
            'icon' : 'fa-plus',
            'handler': add_to_list
        }, 'planetjupyter-plus_cells_to_list', 'Planet Jupyter')
      ])
      }

    // Run on start
  //   var is_marked = function(cell) {
  //     return (cell instanceof codecell.CodeCell) &&
  //         cell.metadata.run_control !== undefined &&
  //         cell.metadata.run_control.marked;
  // };
  //   function add_gutter_events() {
  //     var ncells = Jupyter.notebook.ncells();
  //     var cells = Jupyter.notebook.get_cells();
  //     for (var i = 0; i < ncells; i++) {
  //         var cell = cells[i];
  //         if ((cell.cell_type === "code")) {
  //             cell.code_mirror.on("gutterClick", changeEvent);
  //             if (is_marked(cell)) {
  //                 var g = cell.code_mirror.getGutterElement();
  //                 $(g).css({
  //                     "background-color": params.marked_color
  //                 });
  //             }
  //         }
  //     }
  //   } 
    function load_ipython_extension() {
        // Add a default cell if there are no cells
        if (Jupyter.notebook.get_cells().length===1){
            insert_cell();
        }
        planetJupyterButton();
        // runAllButton();
        // add_gutter_events();
    }
    return {
        load_ipython_extension: load_ipython_extension
    };
});
