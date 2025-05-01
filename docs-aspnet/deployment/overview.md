---
title: Overview
page_title: Deployment Overview
description: Troubleshooting deployment issues involving the {{ site.product_short }} suite.
slug: deployment_overview
position: 0
---

# {{ site.product }} Deployment Overview

This article explains the basics about deploying a {{ site.product_short }} web application. It consists of the following sections:


* [Prerequisites](#prerequisites)
* [Telerik Components](#telerik-components)
* [Next Steps and Troubleshooting](#next-steps-and-troubleshooting)


## Prerequisites

First, make sure you can deploy an ASP.NET Core application without the Telerik components in order to have the entire pipeline working as a baseline.

You can read more about deploying {{ site.framework }} applications in MSDN - make sure that you are familiar with this information, as the {{ site.product }} suite does not add any specific requirements or steps:

{% if site.core %}
* [Host and deploy ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/?view=aspnetcore-9.0)
{% else %}
* [Host and deploy ASP.NET MVC](https://learn.microsoft.com/en-us/aspnet/mvc/overview/deployment/)
{% endif %}

@[template](/_contentTemplates/licensing-templates.md#ci-cd-support)

## License Key

Before building a {{ site.framework }} app in a CI/CD environment, [set up a Telerik license key in CI/CD]({%slug deployment_license_key_aspnetcore%}). The process is different than in a [local development environment]({%slug installation_license_key_aspnetcore%}).

## Telerik Components

The {{ site.product }} components consist of:
* assembly - it is distributed through [NuGet]({%slug nuget_install_aspnetmvc6_aspnetmvc%}). You could find the list with the packages related to UI for ASP.NET Core [here]({% slug nuget_install_aspnetmvc6_aspnetmvc%}#list-of-provided-packages)
* [client-side resources]({%slug copyclientresources_aspnetmvc6_aspnetmvc%}) - the required JavaScript and CSS files needed to run the components

>important The machine that performs the publish build must be able to properly restore the referenced Telerik NuGet packages. See the [CI, CD, Build Server]({%slug deployment_ci_cd_build%}) article for more details on setting automation up.


## Next Steps and Troubleshooting

The following articles provide information on the most common issues and questions related to deployment:

* [Deployment Troubleshooting]({%slug deployment_troubleshooting%}) - common problems and solutions related to deploying Telerik-enabled applications.

* [CI, CD, Build Server]({%slug deployment_ci_cd_build%}) - guidance on setting up continuous integration, continuous delivery and automated builds. Mostly related to using the Telerik NuGet packages as this is the only specific thing that we require.

* [Telerik Private NuGet Feed]({%slug nuget_install_aspnetmvc6_aspnetmvc%}) - general guidance on setting up our private NuGet feed for local use

* [NuGet Feed Troubleshooting]({%slug troubleshooting_telerik_nuget%}) - troubleshooting the most common issues with our nuget feed.


## See Also

* [Set Up Private NuGet Feed for Azure]({%slug howto_setupprivatefeedazure_aspnetcore%})