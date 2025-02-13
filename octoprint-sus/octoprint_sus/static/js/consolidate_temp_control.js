$(function() {
    function ConsolidateTempControlViewModel(parameters) {
        var self = this;

        self.controlViewModel = parameters[0];
        self.temperatureViewModel = parameters[1];

        // fix control tab
        self.onTabChange = function(current, previous) {
            if (current === "#tab_plugin_consolidate_temp_control") {
                var selected = OctoPrint.coreui.selectedTab;
                OctoPrint.coreui.selectedTab = "#control";
                self.controlViewModel.onTabChange("#control", previous);
                OctoPrint.coreui.selectedTab = selected;
            } else if (previous === "#tab_plugin_consolidate_temp_control") {
                self.controlViewModel.onTabChange(current, "#control");
            }
        };

        self.onAllBound = function(allViewModels) {
                var selected = OctoPrint.coreui.selectedTab;
                OctoPrint.coreui.selectedTab = "#control";
                self.controlViewModel.onAllBound(allViewModels);
                OctoPrint.coreui.selectedTab = selected;
        };

        // fix temperature tab
        self.onAfterTabChange = function(current, previous) {
            if (current === "#tab_plugin_consolidate_temp_control") {
                self.temperatureViewModel.onAfterTabChange("#temp", previous);
            } else if (previous === "#tab_plugin_consolidate_temp_control") {
                self.temperatureViewModel.onAfterTabChange(current, "#temp");
            }
        }
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: ConsolidateTempControlViewModel,
        dependencies: ["controlViewModel", "temperatureViewModel"]
    });
});