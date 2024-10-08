# Plugin for iNaturalist.org

- [Download extension for Chrome and Edge](https://chrome.google.com/webstore/detail/tools-for-inaturalist/pmlhnjpkaojokgpabkfbembpklhjobkj)
- [Download addon for Firefox](https://addons.mozilla.org/en-US/firefox/addon/tools-for-inaturalist/)

## Apply GPS Track in Bulk Edit

Adds a button to import a `.gpx` file and apply track point locations to the listed observations with matching timestamps. This will take the track point that is closest to the time of the observation and apply its GPS location. Any observation before the first track point or after the last track point will not be touched. Other fields can be edited manually. _Save All_ will apply the changes.

Bulk edit can be found under _Edit Observations_ where you can enter _Batch edit_ mode by clicking the so named button. You can filter with _Search_ and then select the individual observations you want to work on. Next click on _Edit Selected_ to enter bulk edit.

The GPS Track is not uploaded and only used locally on your computer to localize the observations.

_Note: When saving the bulk edit the server sometimes throws an `504 Gateway Time-out` error, however it looks like changes are still applied after a short time._

---

[Tips](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=UUWCLM5WTHANG&source=url)
