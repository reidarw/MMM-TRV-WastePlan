/*
 * Magic Mirror module for displaying the waste plan for Trondheim Renholdsverk
 * By Reidar W https://github.com/reidarw/MMM-TRV-WastePlan
 * MIT Licensed
 */

Module.register("MMM-TRV-WastePlan", {
    defaults: {
        // Find your ID here: https://trv.no/wp-json/wasteplan/v1/bins/?s=Lokes+veg
        id: 2694,
        header: 'Tømmeplan',
        numberOfWeeks: 5,
        weekDay: 3, // Thursday
        blnNumberOfDays: true,
        blnDate: false,
        dateFormat: "DD. MMM",
        blnWeekNumber: false,
        blnLabel: false,
        blnIcon: true,
        minWidth: 120,
        updateInterval: 6 * 60 * 60 * 1000, // 6 hours
        hideNoPickup: false
    },

    start: function() {
        this.wastePlan = [];
        this.loaded = false;
        this.getWastePlan();
        this.scheduleUpdate();
    },

    getScripts: function() {
        return ['moment.js'];
    },

    getStyles: function() {
        return ['MMM-TRV-WastePlan.css']
    },

    getWastePlan: function() {
        this.sendSocketNotification("GET_WASTE_PLAN", {
            config: this.config
        });
    },

    scheduleUpdate: function(delay) {
        let nextLoad = this.config.updateInterval;
        if (typeof delay !== "undefined" && delay >= 0) {
            nextLoad = delay;
        }
        const self = this;
        setInterval(function() {
            self.getWastePlan();
        }, nextLoad);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "WASTE_PLAN") {
            this.wastePlan = payload;
            this.loaded = true;
            this.updateDom(1000);
        }
    },

    getTranslations: function() {
        return {
            nb: "translations/nb.json",
            en: "translations/en.json"
        };
    },

    getIcon: function(type) {
        let icon;
        switch (type) {
            case 'No pickup':
                icon = 'no-pickup';
                break;
            case 'Non-recyclable waste':
                icon = 'non-recyclable';
                break;
            case 'Paper':
                icon = 'paper';
                break;
            case 'Plastic':
                icon = 'plastic';
                break;
            case 'Garden waste':
                icon ='garden';
                break;
            default:
                icon = 'no-pickup';
        }
        return '<div class="trv-waste-plan-icon ' + icon + '"></div>';
    },

    getNumberOfDaysLabel: function(today, pickUpDate) {
        let numberOfDays = pickUpDate.diff(today, 'days');
        let dayLabel = this.translate("days");
        if (numberOfDays === 1) {
            dayLabel = this.translate("day");
        } else if (numberOfDays === 0) {
            numberOfDays = this.translate("today");
            dayLabel = '';
        } else if (numberOfDays < 0) {
            dayLabel = numberOfDays === -1 ? this.translate("day") : this.translate("days");
        }
        return numberOfDays + ' ' + dayLabel;
    },

    getDom: function() {
        let wrapper = document.createElement("div");
        if (this.config.minWidth) {
            wrapper.style.minWidth = this.config.minWidth + 'px';
        }

        if (this.loaded === false) {
            wrapper.innerHTML = this.translate("loading") + '...';
            wrapper.className = "dimmed light small";
            return wrapper;
        }

        let weekContainer, labelContainer, weekInfo, trashInfo, wasteType;

        moment.locale();
        let today = moment().startOf("day");

        let headerContainer = '';
        if (this.config.header) {
            headerContainer = document.createElement('div');
            headerContainer.innerHTML = this.config.header;
            headerContainer.className = 'light small';
            wrapper.appendChild(headerContainer);
        }

        let weeks = this.config.numberOfWeeks;
        let weekPrinted = false;
        let showOnlyOneWeek = this.config.numberOfWeeks === 1;
        if (showOnlyOneWeek) {
            weeks++;
        }

        for (i = 0; i < weeks; i++) {
            weekContainer = document.createElement("div");
            weekContainer.className = 'trv-waste-plan-week-container';
            labelContainer = document.createElement("div");
            weekInfo = this.wastePlan.calendar[i];
            let pickUpDate = moment(weekInfo.date_week_start).add(this.config.weekDay, 'days');

            if (this.config.hideNoPickup === true && weekInfo.wastetype_en === 'No pickup') {
                continue;
            }
            if (config.language === 'en') {
                wasteType = weekInfo.wastetype_en;
            } else {
                wasteType = weekInfo.wastetype;
            }
            trashInfo = this.config.blnLabel ? wasteType : '';
            if (this.config.blnDate) {
                trashInfo += trashInfo ? ' - ' : '';
                trashInfo += pickUpDate.format(this.config.dateFormat);
            }
            if (this.config.blnNumberOfDays) {
                trashInfo += trashInfo
                    ? ' (' + this.getNumberOfDaysLabel(today, pickUpDate) + ')'
                    : this.getNumberOfDaysLabel(today, pickUpDate);
            }
            if (this.config.blnWeekNumber) {
                trashInfo += trashInfo ? ' - ' : '';
                trashInfo += this.translate("week") + ' '  + weekInfo.week;
            }
            if (this.config.blnIcon) {
                weekContainer.innerHTML = this.getIcon(weekInfo.wastetype_en);
            } else {
                weekContainer.appendChild(document.createElement("div"));
            }

            labelContainer.innerHTML = trashInfo;

            weekContainer.appendChild(labelContainer);

            if (pickUpDate < today) {
                weekContainer.className = 'trv-waste-plan-week-container dimmed light';
            }

            let showData = true;
            if (showOnlyOneWeek && (today > pickUpDate || weekPrinted)) {
                showData = false;
            }

            if (showData) {
                wrapper.appendChild(weekContainer);
                weekPrinted = true;
            }

        }

        return wrapper;
    }
});
