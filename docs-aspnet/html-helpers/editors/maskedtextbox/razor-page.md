---
title: Razor Pages
page_title: Razor Pages
description: "Telerik UI MaskedTextBox for {{ site.framework }} in a RazorPages application."
slug: razorpages_maskedtextboxhelper_aspnetcore
position: 8
---

# MaskedTextBox in Razor Pages

Razor Pages is an alternative to the MVC pattern that makes page-focused coding easier and more productive. This approach consists of a `cshtml` file and a `cshtml.cs` file (by design, the two files have the same name). 

You can seamlessly integrate the Telerik UI MaskedTextBox for {{ site.framework }} in Razor Pages applications.

This article describes how to configure the MaskedTextBox component in a Razor Pages scenario.

For the complete project, refer to the [MaskedTextBox in Razor Pages example](https://github.com/telerik/ui-for-aspnet-core-examples/blob/master/Telerik.Examples.RazorPages/Telerik.Examples.RazorPages/Pages/MaskedTextBox/MaskedTextBoxEditing.cshtml).

## Binding the MaskedTextBox to a PageModel Property

To bind the MaskedTextBox to a property from the `PageModel`, follow the next steps:

1. Declare the `PageModel` at the top of the page.

    ```Razor
        @page
        @model IndexModel
    ```

1. Declare the widget either in a form or as a stand-alone widget:


    ```HtmlHelper
        @page
        @model IndexModel

        @inject Microsoft.AspNetCore.Antiforgery.IAntiforgery Xsrf
        @Html.AntiForgeryToken()

        <form method="post">
            <label for="phone_number">Phone number:</label>
            @(Html.Kendo().MaskedTextBoxFor(c=>c.PhoneNumber)
                        .Mask("(999) 000-0000")
                )
            <br />
            <input type="submit" name="name" value="Submit Form" />
        </form>
    ```
    {% if site.core %}
    ```TagHelper
        @page
        @model IndexModel

        @inject Microsoft.AspNetCore.Antiforgery.IAntiforgery Xsrf
        @Html.AntiForgeryToken()
        @addTagHelper *, Kendo.Mvc

        <form method="post">
            <label for="phone_number">Phone number:</label>
            <kendo-maskedtextbox for="PhoneNumber" mask="(999) 000-0000" >
            </kendo-maskedtextbox>
            <br />
            <input type="submit" name="name" value="Submit Form" />
        </form>
    ```
    {% endif %}

1. Bind the property values in the backend:

    ```C#
        public class IndexModel : PageModel
        {
            [BindProperty]
            public string PhoneNumber { get; set; }

            public void OnGet()
            {
                PhoneNumber = "555 123 4567"; // Assign value to the "PhoneNumber" property, if needed.
            }

            public void OnPost()
            {
                //omitted for clarity
            }
        }
    ```

## See Also

* [Using Telerik UI for ASP.NET Core in Razor Pages](https://docs.telerik.com/aspnet-core/getting-started/razor-pages#using-telerik-ui-for-aspnet-core-in-razor-pages)
* [Client-Side API of the MaskedTextBox](https://docs.telerik.com/kendo-ui/api/javascript/ui/maskedtextbox)
* [Server-Side HtmlHelper API of the MaskedTextBox](/api/maskedtextbox)
* [Server-Side TagHelper API of the MaskedTextBox](/api/taghelpers/maskedtextbox)
* [Knowledge Base Section](/knowledge-base)

