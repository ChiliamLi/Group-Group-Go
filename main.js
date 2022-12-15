define([ 
  'base/js/namespace',
  'base/js/events',
  'services/config',
  'base/js/utils',
  'notebook/js/codecell'
  ], function(Jupyter, events, codecell) {
  var run_list = []; /* list of cells to be run */
  num_groups = 1;
  icon_list = ["fa-bus", "fa-subway", "fa-truck", "fa-car", "fa-bicycle", "fa-plane", "fa-motorcycle", "fa-ship", "fa-rocket"]
  mode = "fa-bus"
  change_group_mode_list = []
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
    var insert_cell = function(div) {
      var button_container = $(div)
      var checkbox = $('<input/>').attr('type', 'checkbox');
      Jupyter.notebook.
      insert_cell_above('code').
      set_text(`print('copy and pasted runtools1')`);
      Jupyter.notebook.select_prev();
      // Jupyter.notebook.execute_cell_and_select_below();

      button_container.append(checkbox);
    };
    var run_current_group = function __execute_with_selection3() {
      var cells = Jupyter.notebook.get_cells();
      const color = group_to_color_dict[mode]
      for (var ii = 0; ii < cells.length; ii++) {
        if (cells[ii].metadata.checked) {
          if (cells[ii].metadata.color == color) {
            cells[ii].execute(false);
          }
        }
      }
    }
    //change group modes
    var change_group_mode0 = function() {
      mode = icon_list[0];
    };
    var change_group_mode1 = function() {
      mode = icon_list[1];
    };
    var change_group_mode2 = function() {
      mode = icon_list[2];
    };
    var change_group_mode3 = function() {
      mode = icon_list[3];
    };
    var change_group_mode4 = function() {
      mode = icon_list[4];
    };
    var change_group_mode5 = function() {
      mode = icon_list[5];
    };
    var change_group_mode6 = function() {
      mode = icon_list[6];
    };
    var change_group_mode7 = function() {
      mode = icon_list[7];
    };
    var change_group_mode8 = function() {
      mode = icon_list[8];
    };
    change_group_mode_list = [change_group_mode0, change_group_mode1, change_group_mode2, change_group_mode3, change_group_mode4, change_group_mode5, change_group_mode6, change_group_mode7, change_group_mode8]
    var add_group = function() {
      num_groups = num_groups + 1; 
      const group_num = num_groups-1
      Jupyter.toolbar.add_buttons_group([
        Jupyter.keyboard_manager.actions.register ({
           'help': 'Add to' + icon_list[group_num] + 'group',
           'icon' : icon_list[group_num],
           'handler': change_group_mode_list[group_num],
           'class' : "btn-group",
           'help_index': group_num.toString()
       }, 'planetjupyter' + group_num, 'Planet Jupyter' + group_num, )
     ])
    };
    // Add Toolbar button
    var planetJupyterButton = function () {
      console.log();
      Jupyter.toolbar.add_buttons_group([
        Jupyter.keyboard_manager.actions.register ({
           'help': 'Run Current Group',
           'icon' : 'fa-play-circle',
           'handler': run_current_group
       }, 'planetjupyter-run_group', 'Planet Jupyter')
     ])
    Jupyter.toolbar.add_buttons_group([
      Jupyter.keyboard_manager.actions.register ({
        'help': 'Add planet jupyter cell',
        'icon' : 'fa-plus',
        'handler': add_group
      }, 'planetjupyter-plus_cells_to_list', 'Planet Jupyter')
    ])
    Jupyter.toolbar.add_buttons_group([
      Jupyter.keyboard_manager.actions.register ({
        'help': 'Go to group0',
        'icon' : icon_list[0],
        'handler': change_group_mode0
      }, 'go to group0', 'Planet Jupyter')
    ])

  var CellToolbar = Jupyter.CellToolbar
  Jupyter.CellToolbar.register_preset('Select Mode', ['tuto.foo'])


  var toggle = function (div, cell) {
      var button_container = $(div)
      var checkbox = $('<input/>').attr('type', 'checkbox');

      checkbox.click(function () {
        var value = checkbox.prop('checked');
        cell.metadata.checked = value;
        
        // Change color when click??
        var checkboxDiv = $(checkbox).parent();
        const color = group_to_color_dict[mode]
        if (value) {
            checkbox.css('accent-color', color);
            cell.metadata.color = color;
        } else {
            checkbox.css('accent-color', "#EEEEEE");
            cell.metadata.color = '#EEEEEE';
        }
        console.log(cell.metadata.checked);
    })

      button_container.append(checkbox);
    }

    

    CellToolbar.register_callback('tuto.foo', toggle);
  }
  
  function load_ipython_extension() {
      // Add a default cell if there are no cells
      if (Jupyter.notebook.get_cells().length===1){
          insert_cell();
      }
      planetJupyterButton();
  }
  return {
      load_ipython_extension: load_ipython_extension
  };
});
