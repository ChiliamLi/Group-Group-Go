<<<<<<< Updated upstream
define([ 
=======
define([
>>>>>>> Stashed changes
  'base/js/namespace',
  'base/js/events',
  'services/config',
  'base/js/utils',
  'notebook/js/codecell'
<<<<<<< Updated upstream
  ], function(Jupyter, events, codecell) {
  var list_of_run_lists = []; /* list of cells to be run */
  for (var ii = 0; ii < 9; ii++) {
    empty_list = [];
    list_of_run_lists.append(empty_list);
  }
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
      const index = group_to_color_index[mode]
      // for (var ii = 0; ii < cells.length; ii++) {
      //   if (cells[ii].metadata.checked) {
      //     if (cells[ii].metadata.color == color) {
      //       cells[ii].execute(false);
      //     }
      //   }
      // }
      for (var ii = 0; ii < list_of_run_lists[index].length; ii++) {
        if (cells[ii]) {
          cells[ii].execute(false);
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

  var delete_from_run_list = function(mode_index, cell) {
    for (var ii = 0; ii < list_of_run_lists[mode_index].length; ii++) {
      if (cell === list_of_run_lists[mode_index][ii]) {
        list_of_run_lists[mode_index][ii] = false; 
        break;
      }
    }
  }
  var toggle = function (div, cell) {
      var button_container = $(div)
      var checkbox = $('<input/>').attr('type', 'checkbox');

      checkbox.click(function () {
        var value = checkbox.prop('checked');
        var mode_index = group_to_color_index[mode]
        cell.metadata.checked = value;
        // Change color when click??
        // var checkboxDiv = $(checkbox).parent();
        const color = group_to_color_dict[mode]
        if (value) {
            checkbox.css('accent-color', color);
            cell.metadata.color = color;
            list_of_run_lists[mode_index].append[cell]; 
        } else {
            checkbox.css('accent-color', "#EEEEEE");
            cell.metadata.color = '#EEEEEE';
            delete_from_run_list(mode_index, cell); 
        }
        console.log(cell.metadata.checked);
    })

      button_container.append(checkbox);
    }
=======
], function (Jupyter, events, codecell) {

  select_mode = true;

  var list_of_run_lists = []; /* list of cells to be run */


  for (var ii = 0; ii < 9; ii++) {
      empty_list = [];
      list_of_run_lists.push(empty_list);
  }

  var list_of_run_sequences = []; /* list of maps of cell_id to sequence */

  for (var ii = 0; ii < 9; ii++) {
      empty_map = {};
      list_of_run_sequences.push(empty_map);
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

          innerCellDiv = current_cell.element[0].childNodes[0].childNodes[1]
          button_container = innerCellDiv.childNodes[0].childNodes[0].childNodes[0]

          console.log(button_container)

          spanSequence = button_container.childNodes[0]
          console.log(spanSequence);
          checkboxElement = button_container.childNodes[1]
          console.log(checkboxElement);
          if (current_run_list_cell_ids.includes(current_cell.cell_id)) {
              console.log("Enter");
              checkboxElement.checked = true;
              checkboxElement.style = "accent-color: " + group_to_color_dict[mode];
          }
          else {
              checkboxElement.checked = false
              checkboxElement.style = "accent-color: " + "#EEEEEE"
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

  var update_sequence_num = function () {
      mode_index = group_to_color_index[mode]
      current_run_list_cell_ids = list_of_run_lists[mode_index].map(a => a.cell_id)
      console.log("current_run_list_cell_ids")
      console.log(current_run_list_cell_ids)

      all_cells = Jupyter.notebook.get_cells()
      for (var i = 0; i < all_cells.length; i++) {
          current_cell = all_cells[i]
          if (current_cell.cell_type != 'markdown') {
            innerCellDiv = current_cell.element[0].childNodes[0].childNodes[1]
            button_container = innerCellDiv.childNodes[0].childNodes[0].childNodes[0]

            console.log(button_container)

            spanSequence = button_container.childNodes[0]
            console.log(spanSequence);
            checkboxElement = button_container.childNodes[1]
            console.log(checkboxElement);
            if (current_run_list_cell_ids.includes(current_cell.cell_id)) {
                console.log("Enter");
                spanSequence.textContent = current_run_list_cell_ids.indexOf(current_cell.cell_id) + 1
            }
            else {
                spanSequence.textContent = ""
            } 
          }
      }
  }

  // Add checkbox and sequence to each cell
  var register_cellbar_select_mode = function () {
      console.log("add select mode presets");

      var CellToolbar = Jupyter.CellToolbar
      Jupyter.CellToolbar.register_preset('Show Select Mode', ['select_mode'])

      var addcheckBox = function (div, cell) {
          var button_container = $(div)
          console.log(button_container)

          var checkbox = $('<input/>').attr('type', 'checkbox');
          var sequence_span = $('<span/>').text('');

          // Add checkbox to click function
          checkbox.click(function () {
              var value = checkbox.prop('checked');
              cell.metadata.checked = value;
              var mode_index = group_to_color_index[mode]

              var color = group_to_color_dict[mode]

              // If checked, add the current cell to run list under this mode
              if (value) {
                  checkbox.css('accent-color', color);
                  list_of_run_lists[mode_index].push(cell);
              }
              // Delete this cell from run list under this mode
              else {
                  checkbox.css('accent-color', "#EEEEEE");
                  delete_from_run_list(mode_index, cell);
              }

              cell.metadata.color = color;
              update_sequence_num();
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

      // Add a default group
      add_group();

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

>>>>>>> Stashed changes

    

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
