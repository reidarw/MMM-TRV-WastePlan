# MMM-TRV-WastePlan
A MagicMirror2 module for showing the waste plan for your destination in Trondheim, Norway.

##### Inspired by:
* https://github.com/blixhavn/MMM-AvfallshentingOslo/blob/main/MMM-AvfallshentingOslo.js
* https://github.com/jeroenpeters1986/MMM-ROVA-trashcalendar
* https://github.com/jonkristian/wasteplan_trv (for Home Assistant)

## Dependencies
  * A [MagicMirror<sup>2</sup>](https://github.com/MichMich/MagicMirror) installation

## Installation

In your terminal, go to your MagicMirror's Module folder:
````
cd ~/MagicMirror/modules
````

Clone this repository and install the dependencies:
````
git clone https://github.com/reidarw/MMM-TRV-WastePlan.git
````

Add the module to the modules array in the `config/config.js` file
and insert your own id. 

```
 {
    module: 'MMM-TRV-WastePlan',
    position: 'top_left',
    config: {
        id: 2694
    }
 },
```
**Note:** 
The id can be found at https://trv.no/wp-json/wasteplan/v1/bins/?s=Your+street+name

Example: https://trv.no/wp-json/wasteplan/v1/bins/?s=Lokes+veg
Returns:
```
[{"name":"Lokes veg","type":"BINS","plan":"P6","calendar":null,"deviations":null,"plans_by_year":{"2020":"P6","2021":"P6"},"id":2694}]
```
Use the number 2694

## Sample screenshot
![MMM-TRV-WastePlan module for MagicMirror](https://raw.githubusercontent.com/reidarw/MMM-TRV-WastePlan/main/MMM-TRV-Wasteplan.png "MMM-TRV-WastePlan module for MagicMirror")


## Optional Config
| **Option** | **Description** |
| --- | --- |
| `header` | Alternative header. Set as empty string to remove. Default: "Tømmeplan" |
| `numberOfWeeks` | Number of weeks to display. Default: 5 |
| `weekDay` | The number of the day in the week when the trash usually get picked up. Monday = 0, Tuesday = 1, Wednesday = 2, Thursday = 3, Friday = 4. Default: 3 |
| `blnNumberOfDays` | Display number of days until pickup. Default: true |
| `blnDate` | Display date for next pickup. Default: false |
| `dateFormat` | If blnDate is true, this date format will be used. Default: DD. MMM |
| `blnWeekNumber` | Display week number. Default: false |
| `blnLabel` | Display label. Default: false |
| `blnIcon` | Display the same icons as your trash bin uses. Default: true |
| `updateInterval` | Interval to update the next pickup dates, in milliseconds. Default: 6 hours |
