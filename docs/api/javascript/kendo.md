---
title: kendo
page_title: API Reference for methods and properties in Kendo UI Framework
description: Examples and detailed explanation of Kendo UI methods and properties.
previous_url: /api/introduction
res_type: api
---

# kendo

## Methods

### alert
Opens a [Kendo UI Alert](/api/javascript/ui/alert) popup. Similar to the native [window.alert()](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert) method.

#### Example - Open a Kendo UI Alert on the page

    <script>
        kendo.alert("This is an alert popup!");
    </script>

#### Parameters

##### text `String`

The text to be shown in the Alert popup.

### antiForgeryTokens
Returns an object that contains common
[CSRF tokens](https://owasp.org/www-community/attacks/csrf)
found on the page.

These include tokens used by ASP.NET, Ruby on Rails and others.

#### Example - Send CSRF tokens in DataSource read request

    <input type="hidden" name="__RequestVerificationToken" value="token" />
    <script>
    var dataSource = new kendo.data.DataSource({
      transport: {
        read: {
          url: "https://demos.telerik.com/service/v2/core/products",
          data: function() {
            return kendo.antiForgeryTokens();
          }
        }
      }
    });

    dataSource.fetch();
    // check the request in the NetworkTab
    </script>

#### Returns
`Object` An object that contains common CSRF tokens found on the page

### bind
Binds a HTML View to a View-Model and initializes Kendo UI widgets from DOM elements based on `data-role` attributes, similar to [`kendo.init()`](/api/javascript/kendo/methods/init).

Model View ViewModel ([MVVM](https://en.wikipedia.org/wiki/Model_View_ViewModel)) is a design pattern which helps developers separate the Model from the View. The View-Model part of MVVM is responsible for
exposing the data objects from the Model in such a way that those objects are easily consumed in the View.

#### Example - bind a DOM element to a view model

     <!-- View -->
     <div id="view">
       <!-- The value of the INPUT element is bound to the "firstName" field of the View-Model.
       When the value changes so will the "firstName" field and vice versa.  -->
       <label>First Name:<input data-bind="value: firstName" /></label>
       <!-- The value of the INPUT element is bound to the "lastName" field of the View-Model.
       When the value changes so will the "lastName" field and vice versa.   -->
       <label>Last Name:<input data-bind="value: lastName" /></label>
       <!-- The click event of the BUTTON element is bound to the "displayGreeting" method of the View-Model.
       When the user clicks the button the "displayGreeting" method will be invoked.  -->
       <button data-bind="click: displayGreeting">Display Greeting</button>
     </div>
     <script>
       // View-Model
       var viewModel = kendo.observable({
          firstName: "John",
          lastName: "Doe",
          displayGreeting: function() {
              // Get the current values of "firstName" and "lastName"
              var firstName = this.get("firstName");
              var lastName = this.get("lastName");
              alert("Hello, " + firstName + " " + lastName + "!!!");
          }
       });

       // Bind the View to the View-Model
       kendo.bind($("#view"), viewModel);
     </script>

#### Parameters

##### element `String|jQuery|Element`

The root element(s) from which the binding starts. Can be a valid jQuery string selector, a DOM element or a jQuery object.
All descendant elements are traversed.

##### viewModel `Object|kendo.data.ObservableObject`

The View-Model which the elements are bound to. Wrapped as an instance of `kendo.data.ObservableObject` if not already.

##### namespace `Object` *(optional)*

Optional namespace to look in when instantiating Kendo UI widgets. The valid namespaces are `kendo.ui` and `kendo.dataviz.ui`. If omitted
`kendo.ui` will be used. Multiple namespaces can be passed.

### confirm
Opens a [Kendo UI Confirm](/api/javascript/ui/confirm) popup. Similar to the native [window.confirm()](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm) method.

#### Example - Open a Kendo UI Confirm on the page

    <script>
        kendo.confirm("Confirm text");
    </script>

#### Parameters

##### text `String`

The text to be shown in the Confirm popup.

#### Returns

`Promise` a [jQuery promise instance](https://api.jquery.com/Types/#Promise), which can be used for callbacks, or passed to [jQuery.when](https://api.jquery.com/jQuery.when/). The jQuery Deferred object resolves to:

* `done()` - when user has pressed the "OK" button;
* `fail()` - when user has pressed the "Cancel" button.

#### Example

    <script>
        kendo.confirm("Confirm text")
            .done(function(){
	/* The result can be observed in the DevTools(F12) console of the browser. */
                console.log("User accepted");
            })
            .fail(function(){
	/* The result can be observed in the DevTools(F12) console of the browser. */
                console.log("User rejected");
            });
    </script>

### culture

Sets or gets the current culture. Uses the passed culture name to select a culture from the culture scripts that you have included and then sets the current culture.
If there is no corresponding culture then the method will try to find culture which is equal to the country part of the culture name.
If no culture is found the default one is used.

> The culture must be set before any Kendo UI widgets that rely on it, are initialized.

#### Example -  include a culture-specific JavaScript file and set the culture
    <script src="https://kendo.cdn.telerik.com/{{ site.cdnVersion }}/js/cultures/kendo.culture.en-GB.min.js"></script>
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
      console.log(kendo.format("{0:c}", 99)); // outputs "$99.00" using the default en-US culture
      kendo.culture("en-GB"); // change the culture
	/* The result can be observed in the DevTools(F12) console of the browser. */
      console.log(kendo.format("{0:c}", 99)); // outputs "£99.00"
    </script>

#### Get the current culture
    <script>
    var culture = kendo.culture();
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(culture.name); // outputs "en-US"
    </script>

#### Parameters

##### culture `String`

The culture to set.

### destroy

Finds all Kendo widgets that are children of the specified element and calls their destroy method.

#### Example

    <input id="autocomplete">
    <script>
    $("#autocomplete").kendoAutoComplete();
	/* The result can be observed in the DevTools(F12) console of the browser. */
      console.log($("#autocomplete").data("kendoAutoComplete") != null); // outputs "true"
      kendo.destroy(document.body);
	/* The result can be observed in the DevTools(F12) console of the browser. */
      console.log($("#autocomplete").data("kendoAutoComplete") != null); // outputs "false"
    </script>

#### Parameters

##### element `String|jQuery|Element`

### format

Replaces each format item in a specified string with the text equivalent of a corresponding object's value. Uses [toString](/api/javascript/kendo/methods/tostring) for every format item.

#### Parameters

##### format `String`
The format string.

#### Returns
`String` The formatted string.

#### Example
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.format("{0} - {1}", 12, 24));  // outputs "12 - 24"
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.format("{0:c} - {1:c}", 12, 24)); // outputs "$12.00 - $24.00"
    </script>

#### See Also

[Supported number formats](/framework/globalization/numberformatting)

### guid

Generates a random GUID (globally unique identifier).

#### Example
    <script>
    var value = kendo.guid();
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(value);
    </script>

#### Returns

`String` The generated GUID.

### htmlEncode

Encodes HTML characters to entities.

#### Example
    <script>
    var value = kendo.htmlEncode("<span>Hello</span>");
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(value);
    </script>

#### Parameters

##### value `String`

The string that needs to be HTML encoded.

#### Returns

`String` The encoded string.

### init

Instantiates Kendo UI widgets in a given DOM element based on role data attributes.

#### Example
     <div id="view">
        <div>
            <input data-role="autocomplete" data-source="data" data-filter="startswith" data-placeholder="select country ..." />
        </div>
     </div>
     <script>
     var data = [ "Albania", "Andorra", "Armenia", "Austria", "Azerbaijan", "Belarus", "Belgium", "Bosnia & Herzegovina", "Bulgaria", "Croatia", "Cyprus"  ];

     kendo.init($("#view"));
     </script>

#### Parameters

##### element `String|jQuery|Element`

The root element(s) from which the instantiation starts. Can be a valid jQuery string selector, a DOM element or a jQuery object. All descendant elements are traversed.

##### namespace `Object` *(optional)*

Optional namespace too look in when instantiating Kendo UI widgets. The valid namespaces are `kendo.ui` and `kendo.dataviz.ui`. If omitted
`kendo.ui` will be used. Multiple namespaces can be passed.

#### Example

     <div id="view">
        <div>
            <input data-role="autocomplete" data-source="data" data-filter="startswith" data-placeholder="select country ..." />
            <button data-role="button" data-click="foo">Foo</button>
        </div>
     </div>

     <script>
     function foo(e) {
	/* The result can be observed in the DevTools(F12) console of the browser. */
         console.log(e.sender); // a button
     }
     var data = [ "Albania", "Andorra", "Armenia", "Austria", "Azerbaijan", "Belarus", "Belgium", "Bosnia & Herzegovina", "Bulgaria", "Croatia", "Cyprus"  ];

     kendo.init($("#view"), kendo.ui);
     </script>
     
### mediaQuery

Enables you to handle media queries in JavaScript using the [MediaQueryList](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList) object. The method returns an object with the `mediaQueryList` field and the `onChange`, `onEnter`, `onLeave`, and `destroy` methods. The `onChange`, `onEnter` and `onLeave` methods accepts a callback function that will be executed when the media query is matched or not matched. The callback function will be passed a single argument - the [MediaQueryListEvent](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryListEvent) instance and return the `mediaQuery` object that enables you to pipe more handlers.

The `onChange` method will be executed when the media query is matched or not matched. The `onEnter` method will be executed when the media query is matched and when the `mediaQuery` is initialized and media is matched. The `onLeave` method will be executed when the media query is not matched.

The `destroy` method will remove the event listeners and destroy the `MediaQueryList` instance. Note that developers should call the `destroy` method when the media query is no longer needed.

You can modify the default [`media queries`](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries) for the adaptive components by modifying the breakpoints defined in `kendo.defaults.breakpoints`. The default break points are defined as:

`kendo.defaults.breakpoints = { small: '(max-width: 700px)', medium: '(min-width: 700.1px) and (max-width: 768px)', large: '(min-width: 768.1px)' }`

#### Parameters

##### media `String`

The media query that will create the [MediaQueryList instance](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList).

#### Returns

`Object` with the `mediaQueryList` field and the `onChange`, `onEnter`, `onLeave` and `destroy` methods.

#### Example - Using a string

    <script>
        const mediaQueryListener = kendo.mediaQuery('(max-width: 500px)')
                                    .onEnter(() => {
                                        console.log('entered 500px width');
                                    });
    </script>

#### Example - Piping more handlers

    <script>
        const mediaQueryListener = kendo.mediaQuery('(min-width: 500px) and (max-width: 1000px)')
                                    .onChange(() => {
                                        console.log('changed screen width between 500px and 1000px');
                                    })
                                    .onEnter(() => {
                                        console.log('entered screen width between 500px and 1000px');
                                    })
                                    .onEnter(() => {
                                        // some other logic
                                    })
                                    .onLeave(() => {
                                        console.log('left screen width between 500px and 1000px');
                                    });
    </script>

#### Example - Destroying the media query listener

    <script>
        const mediaQueryListener = kendo.mediaQuery('(min-width: 500px) and (max-width: 1000px)')
                                    .onEnter(() => {
                                        console.log('entered screen width between 500px and 1000px');
                                    });

        mediaQueryListener.destroy();
    </script>

#### Example - Modify the default breakpoints for the the adaptive components

```dojo
    <input id="dropdownlist"/>
    <script>
      let defaultBreakpoints = {
        small: '(max-width: 2000px)',
        medium: '(min-width: 2000px) and (max-width: 2800px)',
        large: '(min-width: 2800px)'
      }

      kendo.setDefaults('breakpoints', defaultBreakpoints);

      $("#dropdownlist").kendoDropDownList({
        adaptiveMode:"auto",
        dataSource: ["Item1", "Item2"],
        value: "Item1"
      });
    </script>
```


### observableFileManagerData

Creates an ObservableArray instance that is bound to a FileManagerDataSource. Required to bind a FileManagerDataSource-enabled widget (such as the Kendo UI FileManager) to a view-model.

#### Example

    <div id="example">      
        <div name="files"               
            data-role="filemanager"              
            data-bind="source: localData"></div>
    </div>
    <script>
        var myData = [{
            name: "Folder",
            isDirectory: true,
            hasDirectories: false,
            path: "Folder",
            extension: "",
            size: 0,
            createdUtc: new Date(),
            items: [
                {
                    name: "Image.jpg",
                    isDirectory: false,
                    hasDirectories: false,
                    path: "Folder/Image.jpg",
                    extension: ".jpg",
                    size: 20,
                    createdUtc: new Date(),
                },
                {
                    name: "Image2.jpg",
                    isDirectory: false,
                    hasDirectories: false,
                    path: "Folder/Image2.jpg",
                    extension: ".jpg", 
                    size: 20,
                    createdUtc: new Date(),
                }
            ]}
        ];
        
        var viewModel = kendo.observable({        
            localData: kendo.observableFileManagerData(myData),
        });

        kendo.bind($("#example"), viewModel);
    </script>

#### Parameters

##### array `Array`

The array that will be converted to an ObservableArray.


### observableHierarchy

Creates an ObservableArray instance that is bound to a HierarchicalDataSource. Required to bind a HierarchicalDataSource-enabled widget (such as the Kendo UI TreeView) to a view-model.

#### Example

    <div data-role="treeview" data-bind="source: products"></div>
    <script>
    var viewModel = kendo.observable({
      products: kendo.observableHierarchy([
        {
          text: "foo",
          items: [
            { text: "bar" }
          ]
        },
        { text: "baz" }
       ])
    });
    kendo.bind(document.body, viewModel);
    </script>

#### Parameters

##### array `Array`

The array that will be converted to an ObservableArray.

### parseDate

Parses as a formatted string as a `Date`. Also see [Date Parsing](/framework/globalization/dateparsing)

#### Example
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
      console.log(kendo.parseDate("2013/3/4 10:00 AM")); // outputs "Mon Mar 04 2013 10:00:00"
	/* The result can be observed in the DevTools(F12) console of the browser. */
      console.log(kendo.parseDate("3/4/2013", "MM/dd/yyyy")); // outputs "Mon Mar 04 2013 00:00:00"
	/* The result can be observed in the DevTools(F12) console of the browser. */
      console.log(kendo.parseDate("invalid")); // outputs "null"
    </script>

#### Parameters

##### value `String`

The string which should be parsed as `Date`.

##### formats `String|Array` *(optional)*

The format(s) that will be used to parse the date. If you do not explicitly state a date parsing format, the [standard date formats](/framework/globalization/dateformatting#standard) of the current culture will apply.

For more information on the custom date parsing formats, refer to [this article](/framework/globalization/dateformatting#custom).

##### culture `String` *(optional)*

The culture used to parse the number. The current culture is used by default.

#### Returns

`Date` the parsed date. Returns `null` if the value cannot be parsed as a valid `Date`.

### parseExactDate

Parses a formatted string as a `Date`. The method returns `null` if the string doesn't match the format exactly. Also see [Date Parsing](/framework/globalization/dateparsing)

#### Example
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
      console.log(kendo.parseExactDate("2013/3/4 10:00 AM")); // outputs "Mon Mar 04 2013 10:00:00"
	/* The result can be observed in the DevTools(F12) console of the browser. */
      console.log(kendo.parseExactDate("3/4/2013", "MM/dd/yyyy")); // outputs "Mon Mar 04 2013 00:00:00"
      // When the format is not matched, null is returned
	/* The result can be observed in the DevTools(F12) console of the browser. */
      console.log(kendo.parseExactDate("3/4/2013", "MM/dd/yy")); // outputs "null"
      // Unlike kendo.parseDate, which tries to parse the string even though it's a different format:
	/* The result can be observed in the DevTools(F12) console of the browser. */
      console.log(kendo.parseDate("3/4/2013", "MM/dd/yy")); // Wed Mar 04 2020 00:00:00 GMT+0200"
	/* The result can be observed in the DevTools(F12) console of the browser. */
      console.log(kendo.parseExactDate("invalid")); // outputs "null"
    </script>

#### Parameters

##### value `String`

The string which should be parsed as `Date`.

##### formats `String|Array` *(optional)*

The format(s) that will be used to parse the date. If you do not explicitly state a date parsing format, the [standard date formats](/framework/globalization/dateformatting#standard) of the current culture will apply. If you state a format, and the date string doesn't match the format exactly, `null` is returned.

For more information on the custom date parsing formats, refer to [this article](/framework/globalization/dateformatting#custom).

##### culture `String` *(optional)*

The culture used to parse the number. The current culture is used by default.

#### Returns

`Date` the parsed date. Returns `null` if the value cannot be parsed as a valid `Date`.

### parseFloat

Parses a string as a floating point number.

#### Example

    <script src="https://kendo.cdn.telerik.com/{{ site.cdnVersion }}/js/cultures/kendo.culture.de-DE.min.js"></script>
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
      console.log(kendo.parseFloat("12.22")); // outputs "12.22"
      kendo.culture("de-DE");
	/* The result can be observed in the DevTools(F12) console of the browser. */
      console.log(kendo.parseFloat("1.212,22 €")); // outputs "1212.22"
	/* The result can be observed in the DevTools(F12) console of the browser. */
      console.log(kendo.parseFloat("invalid")); // outputs "null"
    </script>

#### Returns

`Number` the parsed number. Returns `null` if the value cannot be parsed as a valid `Number`.

#### Parameters

##### value `String`

The string which should be parsed as a `Number`.

##### culture `String` *(optional)*

The culture used to parse the number. The current culture is used by default.

### parseInt

Parses as a string as an integer.

#### Example

    <script src="https://kendo.cdn.telerik.com/{{ site.cdnVersion }}/js/cultures/kendo.culture.de-DE.min.js"></script>
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
      console.log(kendo.parseInt("12.22")); // outputs "12"
      kendo.culture("de-DE");
	/* The result can be observed in the DevTools(F12) console of the browser. */
      console.log(kendo.parseInt("1.212,22 €")); // outputs 1212
	/* The result can be observed in the DevTools(F12) console of the browser. */
      console.log(kendo.parseInt("invalid")); // outputs "null"
    </script>

#### Returns

`Number` the parsed number. Returns `null` if the value cannot be parsed as a valid `Number`.

#### Parameters

##### value `String`

The string which should be parsed as `Number`.

##### culture `String` *(optional)*

The culture used to parse the number. The current culture is used by default.

### parseColor

Parse a color string to a Color object.  If the input is not valid throws an Error, unless the `noerror` argument is given.

#### Example

    <script>
    var red = kendo.parseColor("#ff0000");
    </script>

#### Parameters

##### color `String`

A string in one of the following (case-insensitive) CSS notations:

- `#F00` (optionally without the sharp: `F00`)
- `#FF0000` (optionally without the sharp: `FF0000`)
- `rgb(255, 0, 0)`
- `rgba(255, 0, 0, 1)`

Particularly if this argument is `null` or the string `"transparent"` then this function will return `null`.

##### noerror `Boolean`*(default: false)*

If you pass `true` then this function will return `undefined` rather than throwing an error on invalid input.

#### Returns

`kendo.Color` A Color object.

### prompt
Opens a [Kendo UI Prompt](/api/javascript/ui/prompt) popup. Similar to the native [window.prompt()](https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt) method.

#### Example - Open a Kendo UI Prompt on the page

    <script>
        kendo.prompt("Prompt text", "Default input text");
    </script>

#### Parameters

##### text `String`

The text to be shown in the Prompt popup.

#### Parameters

##### defaultValue `String`

The default value that will be shown in the popup's input.

#### Returns

`Promise` a [jQuery promise instance](https://api.jquery.com/Types/#Promise), which can be used for callbacks, or passed to [jQuery.when](https://api.jquery.com/jQuery.when/). The jQuery Deferred object resolves to:

* `done()` - when user has pressed the "OK" button and the `data` passed to the callback is the inputted text;
* `fail()` - when user has pressed the "Cancel" button and the `data` passed to the callback is the inputted text.

#### Example

    <script>
        kendo.prompt("Prompt text", "Default input text")
            .done(function(data){
	/* The result can be observed in the DevTools(F12) console of the browser. */
                console.log("User accepted with text: " + data);
            })
            .fail(function(data){
	/* The result can be observed in the DevTools(F12) console of the browser. */
                console.log("User rejected with text: " + data);
            });
    </script>

### proxyModelSetters

Creates a wrapper object over the passed one, with get/set properties that set the original object `dirty` flag. Suitable for a scenario where a dataSource item is used in a third-party MVVM implementation, like AngularJS.

#### Parameters

##### data `kendo.data.Model`

The model that will be wrapped.

### render

Renders the specified template using the provided array.

#### Example
    <ul></ul>
    <script>
    var template = kendo.template("<li>#: name #</li>");
    var data = [ { name: "John Doe" }, { name: "Jane Doe" }];
    var html = kendo.render(template, data);
    $("ul").html(html);
    </script>

#### Parameters

##### template `Function`

The Kendo UI template which should be rendered. Create one via the [template](/api/javascript/kendo/methods/template) method.

##### data `Array`

The array of objects which contains the data that the template will render.

### resize

Finds all Kendo widgets that are children of the specified element and calls their `resize` method.

#### Example

    <div class="chart-wrapper">
       <div id="chart" style="width:100%"></div>
    </div>
    <script>
        $(function() {
            $("#chart").kendoChart({
                title: {
                    text: "Gross domestic product growth /GDP annual %/"
                },
                legend: {
                    position: "bottom"
                },
                seriesDefaults: {
                    type: "area"
                },
                series: [{
                    name: "India",
                    data: [3.907, 7.943, 7.848, 9.284, 9.263, 9.801, 3.890, 8.238, 9.552, 6.855]
                }],
                valueAxis: {
                    labels: {
                        format: "{0}%"
                    },
                    line: {
                        visible: false
                    },
                    axisCrossingValue: -10
                },
                categoryAxis: {
                    categories: [2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011],
                    majorGridLines: {
                        visible: false
                    }
                },
                tooltip: {
                    visible: true,
                    format: "{0}%",
                    template: "#= series.name #: #= value #"
                }
            });
        });

        $(window).on("resize", function() {
          kendo.resize($(".chart-wrapper"));
        });
    </script>

#### Parameters

##### element `String|jQuery|Element`

##### force `Boolean`*(default: false)*

Determines whether the resizing routine should be executed even if the respective widget's outer dimensions have not changed. The parameter will be passed to the [widget's `resize` method](/using-kendo-in-responsive-web-pages#individual-widget-resizing).

### saveAs
Saves a file with the specified name and content.
A server "echo" proxy might be required, depending on browser capabilities.

#### Parameters

##### options `Object`
Configuration options for the save operation.

##### options.dataURI `String`
The file contents encoded as a [Data URI](https://developer.mozilla.org/en-US/docs/Web/HTTP/data_URIs).

Only base64-encoded Data URIs are supported.

##### options.fileName `String`
The desired file name.

##### options.forceProxy `Boolean` *(default: false)*
If set to true, the content will be forwarded to proxyURL even if the browser supports saving files locally.

##### options.proxyURL `String` *(optional)*
The URL of the server side proxy which will stream the file to the end user.

A proxy will be used when the browser isn't capable of saving files locally.
Such browsers are IE version 9 and lower and Safari.

The developer is responsible for implementing the server-side proxy.

When a proxy is used the `kendo.saveAs()` method includes any CSRF and anti-forgery tokens out of the box as long as they are present on the page. The logic internally uses the [`kendo.antiForgeryTokens()`](/api/javascript/kendo/methods/antiforgerytokens) method and adds that to the request data as it posts to the proxy.

The proxy will receive a POST request with the following parameters in the request body:

* `contentType`&mdash;This is the MIME type of the file.
* `base64`&mdash;The `base-64`-encoded file content.
* `fileName`&mdash;The file name as requested by the caller.
* Any anti-forgery tokens if present on the page

The proxy should return the decoded file with set `"Content-Disposition"` header.

#### Example - Saving a text file
    <script>
        kendo.saveAs({
            dataURI: "data:text/plain,Report title and text",
            fileName: "report.txt"
        });
    </script>

##### options.proxyTarget `String` *(default: "_self")*

A name or keyword indicating where to display the document returned from the proxy.

If you want to display the document in a new window or iframe,
the proxy should set the "Content-Disposition" header to `inline; filename="<fileName.ext>"`.

### stringify

Converts a JavaScript object to [JSON](https://en.wikipedia.org/wiki/JSON). Uses [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) in browsers that support it.

#### Parameters

##### value `Object`

The value to convert to a JSON string.

#### Returns

`String` The JSON representation of the value.

#### Example

    <script>
    var json = kendo.stringify({ foo: "bar" });
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(json); // displays {"foo":"bar"}
    </script>

### template

Compiles a template to a function that builds HTML. Useful when a template will be used several times.
Templates offer way of creating HTML chunks. Options such as HTML encoding and compilation for optimal
performance are available.

#### Example - Basic template

    <span id="output"></span>
    <script>
    var template = kendo.template("Hello, #= firstName # #= lastName #");
    var data = { firstName: "John", lastName: "Doe" };
    $("#output").html(template(data));
    </script>

#### Example - encode HTML

    <span id="output"></span>
    <script>
    var template = kendo.template("HTML tags are encoded: #: html #");
    var data = { html: "<strong>lorem ipsum</strong>" };
    $("#output").html(template(data));
    </script>

#### Example - use JavaScript in the template

    <span id="output"></span>
    <script>
    var template = kendo.template("#if (foo) {# foo is true #}#");
    var data = { foo: true };
    $("#output").html(template(data));
    </script>

#### Example - escape sharp ("#") symbols in an inline template

    <span id="output"></span>
    <script>
    var template = kendo.template("<a href='\\#'>link</a>");
    $("#output").html(template({}));
    </script>

#### Example - escape sharp ("#") symbols in a template defined in a script element

    <span id="output"></span>
    <script type="text/x-kendo-template" id="template">
    <a href="\#">link</a>
    </script>
    <script>
    var template = kendo.template($("#template").html());
    $("#output").html(template({}));
    </script>

#### Example - use a function in a template

    <div id="example"></div>
    <script id="javascriptTemplate" type="text/x-kendo-template">
        <ul>
        # for (var i = 0; i < data.length; i++) { #
            <li>#= myCustomFunction(data[i]) #</li>
        # } #
        </ul>
    </script>
    <script type="text/javascript">
        // Use a custom function inside the template and define it in the global JavaScript scope.
        function myCustomFunction (str) {
            return str.replace(".", " ");
        }
        // Get the external template definition by using a jQuery selector.
        var template = kendo.template($("#javascriptTemplate").html());
        // Create some dummy data.
        var data = ["Todd.Holland", "Steve.Anglin", "Burke.Ballmer"];
        var result = template(data); //Execute the template
        $("#example").html(result); //Append the result
    </script>

#### Returns
`Function` the compiled template as a JavaScript function. When called this function will return the generated HTML string.

#### Parameters

##### template `String`

The template that will be compiled.

##### options `Object` *(optional)*

Template compilation options.

##### options.paramName `String` *(default: "data")*

The name of the parameter used by the generated function. Useful when `useWithBlock` is set to `false`.

###### Example

    var template = kendo.template("<strong>#: d.name #</strong>", { paramName: "d", useWithBlock: false });

##### options.useWithBlock `Boolean` *(default: true)*

Wraps the generated code in a `with` block. This allows the usage of unqualified fields in the template. Disabling the `with` block will improve
the performance of the template.

###### Example
    var template = kendo.template("<strong>#: data.name #</strong>", { useWithBlock: false }); // Note that "data." is used to qualify the field

	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(template({ name: "John Doe" })); // outputs "<strong>John Doe</strong>"

### throttle

Limits the number of calls to a function to one for a specified amount of time.

#### Example

    <script>
      var throttled = kendo.throttle(function() {
	/* The result can be observed in the DevTools(F12) console of the browser. */
          console.log("hey! " + new Date());
      }, 100);

      // will log two times "hey":
      // (1) once for the first call
      // (2) once for the last call, roughly 100ms after the first one
      for (var i = 0; i < 10; i++) {
          throttled();
      }
    </script>

#### Parameters

##### fn `Function`

The function to be throttled.

##### timeout `Number`

The amount of time that needs to pass before a subsequent function call is made.

#### Returns

`Function` the throttled function

### touchScroller

Enables kinetic scrolling on touch devices

#### Example
    <div id="scrollable" style="height: 200px">
      Scrollable
      <div style="height: 1000px">content</div>
    </div>
    <script>
      kendo.touchScroller($("#scrollable"));
    </script>

#### Parameters

##### element `String|jQuery|Element`

The container element to enable scrolling for.

### toString

Formats a `Number` or `Date` using the specified format and the current culture.

#### Example
    <script src="https://kendo.cdn.telerik.com/{{ site.cdnVersion }}/js/cultures/kendo.culture.de-DE.min.js"></script>
    <script>
      // Format a number using standard number formats and default culture (en-US)
	/* The result can be observed in the DevTools(F12) console of the browser. */
      console.log(kendo.toString(10.12, "n"));  // "10.12"
	/* The result can be observed in the DevTools(F12) console of the browser. */
      console.log(kendo.toString(10.12, "n0")); // "10"
	/* The result can be observed in the DevTools(F12) console of the browser. */
      console.log(kendo.toString(10.12, "n5")); // "10.12000"
	/* The result can be observed in the DevTools(F12) console of the browser. */
      console.log(kendo.toString(10.12, "c"));  // "$10.12"
	/* The result can be observed in the DevTools(F12) console of the browser. */
      console.log(kendo.toString(0.12, "p"));   // "12.00 %"

      // Format a number using custom number formats
	/* The result can be observed in the DevTools(F12) console of the browser. */
      console.log(kendo.toString(19.12, "00##")); // "0019"

      // Format a number using standard number format and a specific culture de-DE (default culture is en-US)
	/* The result can be observed in the DevTools(F12) console of the browser. */
      console.log(kendo.toString(10.12, "c", "de-DE")); // "10,12" €

      // Format a date
	/* The result can be observed in the DevTools(F12) console of the browser. */
      console.log(kendo.toString(new Date(2010, 9, 5), "yyyy/MM/dd" ));         // "2010/10/05"
	/* The result can be observed in the DevTools(F12) console of the browser. */
      console.log(kendo.toString(new Date(2010, 9, 5), "dddd MMMM d, yyyy" ));  // "Tuesday October 5, 2010"
	/* The result can be observed in the DevTools(F12) console of the browser. */
      console.log(kendo.toString(new Date(2010, 10, 10, 22, 12), "hh:mm tt" )); // "10:12 PM"
    </script>

#### Returns

`String` the string representation of the formatted value.

#### Parameters

##### value `Date|Number`

The `Date` or `Number` which should be formatted.

##### format `String`

The format string which should be used to format the value. [Number formatting](/framework/globalization/numberformatting) and [date formatting](/framework/globalization/dateformatting) depends on the current culture.

##### culture `String` *(optional)*

The name of the culture which should be used to format the value. [The culture should be registered on the page](/framework/globalization/overview#add culture scripts to the page).

### unbind

Unbinds a tree of HTML elements from a View-Model.

#### Example
     <div id="view">
       <label>First Name:<input data-bind="value: firstName" /></label>
       <label>Last Name:<input data-bind="value: lastName" /></label>
       <button data-bind="click: displayGreeting">Display Greeting</button>
     </div>
     <script>
     var viewModel = kendo.observable({
        firstName: "John",
        lastName: "Doe",
        displayGreeting: function() {
            // Get the current values of "firstName" and "lastName"
            var firstName = this.get("firstName");
            var lastName = this.get("lastName");
            alert("Hello, " + firstName + " " + lastName + "!!!");
        }
     });
     kendo.bind($("#view"), viewModel);
     // unbind the view model
     kendo.unbind($("#view"));
     </script>

#### Parameters

##### element `String|jQuery|Element`

The root element(s) from which the unbinding starts. Can be a valid jQuery string selector, a DOM element or a jQuery object.
All descendant elements are traversed.

### unescape

Decodes string from UTF-8 or a Unicode character set. Substitutes the native [`unescape`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/unescape) function, which should not be used according to the recommendations of the ECMA-262 standard.

#### Example
    <script>
        var result = kendo.unescape("This is a test: %97 %3f %D5 %e5 %U0107 %U123F %u39f5 %uDEe5");
	/* The result can be observed in the DevTools(F12) console of the browser. */
        console.log(result);

        var second = kendo.unescape("This is a test: %D1%88%D0%B5%D0%BB%D0%BB%D1%8B");
	/* The result can be observed in the DevTools(F12) console of the browser. */
        console.log(second);
    </script>

#### Parameters

##### value `String`

The string that needs to be unescaped (decoded).

#### Returns

`String` The unescaped (decoded) string.

### widgetInstance

Returns a Kendo UI widget instance, attached to the provided element.
This method can be used in scenarios when the page (e.g. a form) contains both generic HTML elements and Kendo UI widgets and the exact distribution is not clear.

#### Parameters

##### element `jQuery`

The DOM element that may have a Kendo UI instance attached to it.

##### suite `Object` *(optional)*

**Optional**. The Kendo UI suite, that the widget is expected to be part of - `kendo.ui` (web widgets) or `kendo.dataviz.ui`. As of Q1 2014 you can also pass an array of suites.

#### Returns

`Object` The Kendo UI widget instance with all applicable methods and fields, if the instance is attached to the provided element.

`undefined` otherwise

#### Example - using kendo.widgetInstance()

	// get element
	var textbox = $("#myTextBox");
	// get widget object
	var widget = kendo.widgetInstance(textbox);
	if (widget) {
		// execute an API method
		widget.value(/* ... */);
	} else {
		// execute generic jQuery method
		textbox.val(/* ... */);
	}

## Fields

### keys

A dictionary of special keys' ASCII codes, which can be accessed by user-friendly names, instead of their numeric values.
The collection includes only key codes, which are used by the Kendo UI widgets' source code.

#### kendo.keys collection

    kendo.keys = {
        INSERT: 45,
        DELETE: 46,
        BACKSPACE: 8,
        TAB: 9,
        ENTER: 13,
        ESC: 27,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        END: 35,
        HOME: 36,
        SPACEBAR: 32,
        PAGEUP: 33,
        PAGEDOWN: 34,
        F2: 113,
        F10: 121,
        F12: 123,
        NUMPAD_PLUS: 107,
        NUMPAD_MINUS: 109,
        NUMPAD_DOT: 110
    }

The key codes are especially helpful in keydown, keyup and keypress event handlers.

#### kendo.keys usage example

    function onMyKeyPress(e) {
        // if ENTER key is pressed, do something
        if (e.keyCode == kendo.keys.ENTER) {
            // .....
        }
    }

### support

A range of useful supported by the current browser capabilities and features.

#### support

##### touch `Boolean`
Return true if the browser supports touch events.

##### pointers `Boolean`
Return true if the browser supports pointer events (IE10 and Metro apps currently).

##### scrollbar `Function`
Checks for the browser scrollbar width, returns scrollbar width in pixels, 0 if no scrollbars available (e.g. in mobile).

##### hasHW3D `Boolean`
Return true if the browser supports 3D transitions and transforms.

##### hasNativeScrolling `Boolean`
Returns true if the browser supports overflow-scrolling CSS property (currently only iOS 5+).

##### devicePixelRatio `Number` *(default: 1)*
Returns the current device's Device to Pixel Ratio. Doesn't work in Windows Phone 8, where IE10 doesn't support it.

##### placeholder `Boolean`
Returns `true` if the browser supports input placeholders.

##### zoomLevel `Number` *(default: 1)*
Returns the current zoom level on a mobile browser (returns 1 on desktop).

### support.mobileOS `Object`
Returns a number of properties that identify the current mobile browser. Parses navigator.userAgent to do it. False on desktop.

#### support.mobileOS
##### device `String`
Returns the current mobile device identifier, can be "fire", "android", "iphone", "ipad", "meego", "webos", "blackberry", "playbook", "wp", "windows".

##### tablet `String` *(default: false)*
Returns the current tablet identifier or false if the current device is not a tablet, can be "fire", "ipad", "playbook" or false.

##### browser `String` *(default: "default")*
Returns the current browser identifier or "default" if the browser is the native one, can be "omini", "omobile", "firefox", "mobilesafari", "webkit", "ie", "default".

##### name `String`
Returns the current os name identifier, can be "ios", "android", "blackberry", "windows", "webos", "meego". For convenience a property with the os name is also initialized,
for instance:

    if (kendo.support.mobileOS.android) {
        // Do something in Android
    }

##### majorVersion `String`
The current OS major version, e.g. "5" in iOS 5.1.

##### minorVersion `String`
The current OS minor versions, e.g. "1.1" in iOS 5.1.1.

##### flatVersion `Number`
A convenience property to allow easier version checks, for instance:

    var os = kendo.support.mobileOS;
    if (os.ios && os.flatVersion >= 400 && os.flatVersion < 500) {
        // Do something in iOS 4.x
    }

##### appMode `Boolean`
Returns true if running in application mode - pinned to desktop in iOS or running in PhoneGap/WebView.

##### cordova `Boolean`
Returns true if running in a Cordova/PhoneGap/Telerik AppBuilder application.

### support.browser `Object`
Convenience replacement for the now deprecated jQuery.browser. It returns an object with the browser identifier initialized as a boolean property and a version.
The identifiers are identical to jQuery ones, e.g. "webkit", "opera", "msie", "edge" and "mozilla". In addition WebKit browsers will return their name e.g. "safari" and "chrome".

    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
        console.log(kendo.stringify(kendo.support.browser));
        // Chrome will return this object: { "webkit": true, "chrome": true, "version": 37 }
        // IE11 will return this one: { "msie": true, "version": 11 }
    </script>

#### support.browser
##### version `Number`
The current browser major version, e.g. "7" in Internet Explorer 7.

### version `String`

Returns the Kendo UI version as a string, for example `"2013.3.1119"` or `"2013.2.918"`, etc. In general, Kendo UI version identifiers provide the following information:

* year in YYYY format (2013, 2012, etc);
* major release as "1", "2" or "3" (derived from R1, R2 and R3). All service packs and internal builds, which come after a given major release, share the same major release number;
* month and day of the release in Mdd format (November 19, September 18, etc);

R3 service packs and internal builds may be released in the following year. In this case 12 is added to the month number, e.g. 13 means January, 14 means February and so on.
For example `"2012.3.1315"` means a service pack (internal build) released after R3 **2012** on January 15, **2013**.

The returned value does not indicate if the given Kendo UI version represents a major release, service pack, or the so-called internal (nightly) build.

## Standard number formats

#### *n*

Formats the value as a number with decimal and thousand separators.

##### Example

    <script src="https://kendo.cdn.telerik.com/{{ site.cdnVersion }}/js/cultures/kendo.culture.de-DE.min.js"></script>
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(1234.567, "n")); // outputs "1,234.57"
    kendo.culture("de-DE");
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(1234.567, "n3")); //outputs "1.234,567"
    </script>

#### *c*

Formats the value by adding the currency symbol.

##### Example

    <script src="https://kendo.cdn.telerik.com/{{ site.cdnVersion }}/js/cultures/kendo.culture.de-DE.min.js"></script>
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(1234.567, "c")); // outputs "$1,234.57"
    kendo.culture("de-DE");
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(1234.567, "c3")); // outputs "1.234,567 €"
    <script>

#### *p*

Formats the value as percentage (the value is multiplied by 100).

##### Example

    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(0.222, "p")); // outputs "22.20 %"
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(0.22, "p3")); // outputs "22.000 %"
    </script>

#### *e*

Returns the value in exponential format.

##### Example
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(0.122, "e")); // outputs "1.22e-1"
    </script>

## Custom number formats

Custom number formats can be created by using one or more custom numeric specifiers.

#### Format Specifiers

#### *0*

Zero placeholder. Replaces the zero with the corresponding digit if one is present; otherwise, zero appears in the result string.

##### Example
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(1234.5678, "00000")); // outputs "01235"
    </script>

#### *#*

Digit placeholder. Replaces the pound sign with the corresponding digit if one is present; otherwise, no digit appears in the result string.

##### Example

    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(1234.5678, "#####")); // outputs "1235"
    </script>

#### *.*

Decimal placeholder. Determines the position of the decimal separator in the result string.

##### Example

    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(0.45678, "0.00")); // outputs "0.46"
    </script>

#### *,*

Group separator. Inserts a group separator between each group of digits.

##### Example
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(12345678, "##,#")); // outputs "12,345,678"
    </script>

#### *%*

Percentage. Multiplies a number by 100 and inserts a the percentage symbol (according to the current culture) in the result string.

##### Example
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
      console.log(kendo.toString(0.14, "#%")); // outputs "14%"
    </script>

#### *e*

Exponential notation.

##### Example
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(0.45678, "e0")); // outputs "5e-1"
    </script>

#### *;*

Section separator. Defines sections of separate format strings for positive, negative, and zero numbers.

##### Example

    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
      console.log(kendo.toString(3.14, "0.0;0.00")); // outputs "3.1"
	/* The result can be observed in the DevTools(F12) console of the browser. */
      console.log(kendo.toString(-3.14, "0.0;-0.00")); // outputs "-3.14"
    </script>

#### *"string"|'string'*

Literal string. Indicates literal strings which should be included in the result verbatim.

##### Example

## Standard date formats

#### *d*

Short date pattern.

##### Example

    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(new Date(2000, 10, 6), "d")); // outputs "11/6/2000"
    </script>

#### *D*

Long date pattern.

##### Example
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(new Date(2000, 10, 6), "D")); // outputs "Monday, November 06, 2000"
    </script>

#### *F*

Full date time pattern.

##### Example

    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(new Date(2000, 10, 6), "F")); // outputs "Monday, November 06, 2000 12:00:00 AM"
    </script>

#### *g*

General date/time pattern (short time).

##### Example
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(new Date(2000, 10, 6), "g")); // outputs "11/6/2000 12:00 AM"
    </script>

#### *G*

General date/time pattern (long time).

##### Example
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(new Date(2000, 10, 6), "G")); // outputs "11/6/2000 12:00:00 AM"
    </script>

#### *m|M*

Day of month pattern.

##### Example
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(new Date(2000, 10, 6), "m")); // outputs "November 06"
    </script>

#### *u*

Universal sortable date/time pattern

##### Example
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(new Date(2000, 10, 6), "u")); // outputs "2000-11-06 00:00:00Z"
    </script>

#### *y|Y*

Month year pattern.

##### Example
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(new Date(2000, 10, 6), "y")); // outputs "November, 2000"
    </script>

## Custom date formats
Custom date formats can be created by using one or more custom date specifiers.

#### Format Specifiers

#### *d*

The day of the month, from 1 to 31.

##### Example
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(new Date(2013, 5, 6), "yyyy/M/d")); // outputs "2013/6/6"
    </script>

#### *dd*

The zero-padded day of the month - from 01 to 31.

##### Example
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(new Date(2013, 5, 6), "yyyy/M/dd")); // outputs "2013/6/06"
    </script>

#### *ddd*

The abbreviated name of the day of the week.

##### Example
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(new Date(2013, 5, 6), "ddd,yyyy/M")); // outputs "Thu, 2013/6"
    </script>

#### *dddd*

The full name of the day of the week.

##### Example
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(new Date(2013, 5, 6), "ddd,yyyy/M")); // outputs "Thursday, 2013/6"
    </script>

#### *f*

The tenths of a second.

##### Example
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(new Date(2013, 5, 6, 5, 5, 5, 500), "f")); // outputs "5"
    </script>

#### *ff*

The hundreds of a second.

##### Example
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(new Date(2013, 5, 6, 5, 5, 5, 500), "ff")); // outputs "50"
    </script>

#### *fff*

The milliseconds.

##### Example
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(new Date(2013, 5, 6, 5, 5, 5, 500), "fff")); // outputs "500"
    </script>

#### *M*
The month, from 1 to 12.

##### Example
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(new Date(2013, 5, 6), "yyyy/M/d")); // outputs "2013/6/6"
    </script>

#### *MM*

The zero-padded month, from 01 to 12.

##### Example
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(new Date(2013, 5, 6), "yyyy/MM/d")); // outputs "2013/06/6"
    </script>

#### *MMM*
The abbreviated name of the month.

##### Example
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(new Date(2013, 5, 6), "yyyy/MMM/d")); // outputs "2013/Jun/6"
    </script>

#### *MMMM*

The full name of the month.

##### Example
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(new Date(2013, 5, 6), "yyyy/MMM/d")); // outputs "2013/June/6"
    </script>

#### *h*
The hour, using 12-hour clock from 1 to 12.

##### Example
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(new Date(2013, 5, 6, 6, 0), "h")); // outputs "6"
    </script>

#### *hh*
The zero-padded hour, using 12-hour clock from 01 to 12.

##### Example
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(new Date(2013, 5, 6, 6, 0), "h")); // outputs "06"
    </script>

#### *H*

The hour, using 24-hour clock from 0 to 23.

##### Example
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(new Date(2013, 5, 6, 13, 0), "H")); // outputs "13"
    </script>

#### *HH*

The zero-padded hour, using 24-hour clock from 00 to 23.

##### Example
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(new Date(2013, 5, 6, 6, 0), "HH")); // outputs "06"
    </script>

#### *m*

The minute, from 0 to 59.

##### Example
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(new Date(2013, 5, 6, 6, 30), "m")); // outputs "30"
    </script>

#### *mm*

The zero-padded minute, from 00 to 59.

##### Example
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(new Date(2013, 5, 6, 6, 5), "mm")); // outputs "05"
    </script>

#### *s*

The second, from 0 to 59.

##### Example
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(new Date(2013, 5, 6, 6, 5, 5), "s")); // outputs "5"
    </script>

#### *ss*

The zero-padded second, from 00 to 59.

##### Example
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(new Date(2013, 5, 6, 6, 5, 5), "ss")); // outputs "05"
    </script>

#### *tt*

The AM/PM designator.

##### Example
    <script>
	/* The result can be observed in the DevTools(F12) console of the browser. */
    console.log(kendo.toString(new Date(2013, 5, 6, 13, 0), "HH tt")); // outputs "13 PM"
    </script>
