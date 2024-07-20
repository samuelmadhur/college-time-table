window.onload = function() {
    config.load_data();
    translator.translate_ui();

    show_options();
};



function show_options() {
    show_timetable_options();

    function show_timetable_options() {
        var timetable_settings_group = document.getElementById("timetable_settings_group");
        for (day_object of config.data.timetable) {

            timetable_settings_group.innerHTML +=
                "<div class='input_group'>" +
                `<input name='day_name_input' value='${day_object.day}'/>` +
                "</div>";


            var schedule_inputs_container = document.createElement("div");
            schedule_inputs_container.classList.add("schedule_inputs_container");

            for (var i = 0; i < config.data.periods.length; i++) {
                try {
                    var period = !!config.data.periods[i] ? config.data.periods[i] : []
                    if (Object.keys(period).length > 0) {
                        var start = (period.start).split(":")
                        var start_amp = start[0] >= 12 ? "PM" : "AM";
                        var start_hr = start[0] >= 13 ? parseInt(start[0]) - 12 : start[0];
                        var start_min = start[1];

                        var end = (period.end).split(":")
                        var end_amp = end[0] >= 12 ? "PM" : "AM";
                        var end_hr = end[0] >= 13 ? parseInt(end[0]) - 12 : end[0];
                        var end_min = end[1];

                        start_hr = String(start_hr).padStart(2, 0)
                        start_min = String(start_min).padStart(2, 0)

                        end_hr = String(end_hr).padStart(2, 0)
                        end_min = String(end_min).padStart(2, 0)
                        schedule_inputs_container.innerHTML += `<div class='routine-sched'>Period: ${start_hr}:${start_min} ${start_amp} - ${end_hr}:${end_min} ${end_amp}</div>`

                    }
                    add_period_input_group(day_object.schedule[i].subject, day_object.schedule[i].room);
                } catch (TypeError) {
                    add_period_input_group("", "");
                }
            }

            timetable_settings_group.append(schedule_inputs_container);
        }


        function add_period_input_group(subject, room) {
            schedule_inputs_container.innerHTML +=
                "<div class='input_group'>" +
                `<input value='${subject}' placeholder="Subject"/>` +
                `<input value='${room}' placeholder="Room"/>` +
                "</div>";
        }
    }
}


function save() {
    var day_name_inputs = document.querySelectorAll("#timetable_settings_group [name='day_name_input']");
    var schedule_input_group_containers = document.querySelectorAll("#timetable_settings_group > .schedule_inputs_container");

    if (day_name_inputs.length != schedule_input_group_containers.length) {
        alert("Error saving timetable settings");
        return false;
    }


    var new_timetable = [];

    for (var i = 0; i < day_name_inputs.length; i++) {
        var schedule_input_groups = schedule_input_group_containers[i].getElementsByClassName("input_group");

        var new_timetable_day = {
            day: day_name_inputs[i].value,
            schedule: []
        }

        for (input_group of schedule_input_groups) {
            var subject = input_group.children[0].value;
            var room = input_group.children[1].value;

            new_timetable_day.schedule.push({
                "subject": subject,
                "room": room,
            });
        }

        new_timetable.push(new_timetable_day);
    }

    config.data.timetable = new_timetable;
    config.save_data(config.data);
    alert("Timetable settings have been saved. Changes will take effect after page refresh.");
}