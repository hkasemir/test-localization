# UI localization proposal
For the purpose of this proposal, UI localization will be defined as the translating of the user interface (navigation links, buttons, page copy, etc) into different languages to provide a usable experience for non-english-speaking users.

## Goals
The goal of this overhaul of the current methodologies for our ui localization is to provide the following:
 - painless scalability of our UIs to any number of new languages
 - ease of translation of ui strings for the localization teams
 - quality of localization infrastructure (high flexibility, ease of dev and localizer workflows, low brittleness)
 - reduce delivered app size by fetching language on request rather than bundling all translations into an app.

## TLDR
Our current method of ui localization is brittle and doesn't scale to new languages. Everything from the quality of the infrastructure to the processes used by the localization teams to translate source strings is in need of an overhaul. This proposal outlines why we should update our current strategies, and suggests a method for how, including libraries already available to be used, and tools we can build to enhance the functionality of these libraries. As a bonus, building these tools open up the opportunity to contribute to open source!

## Developer workflow changes
there are many libraries out there for doing localization in react, but I've put here the three best possibilities for localizing using existing react libraries:
[react-intl](https://www.npmjs.com/package/react-intl)
[react-i18next](https://www.npmjs.com/package/react-i18next)
[fluent-react](https://www.npmjs.com/package/fluent-react)

The proposal is for fluent, because despite it being a newer contender on the scene, it appears to be a very powerful framework, with high flexibility, scalability, and opportunity for quality tooling over the other options.
### Fluent / Fluent React
[Fluent](https://github.com/projectfluent/fluent.js) is a localization framework being developed by engineers at mozilla to "unleash the expressive power of the natural language" - essentially create high quality, scalable, and flexible translations for UIs.
#### Points of friction
In an ideal world, developers would not have to do anything outside of their monolingual workflows to get everything to just work. Below are things I have found in working with fluent that have caused me to have to do a significant amount of extra / cognitive work to accomplish.

##### wrapping everything in a `Localized` component is ugly and makes my code harder to read.
```js
<Localized id='Scope_description'>
  <p>this text has something to say</p>
</Localized>

// could turn into
<P l10nId='Scope_description'>this text has something to say</P>
```

##### adding variables in a translated message is confusing
```js
<Localized id='Scope_descriptionLVariable' $name={user.name}>
  <p>{'this text is for { $name }'}</p>
</Localized>
```

in the ideal case it could turn into
```js
<P l10nId='Scope_descriptionVariable'>this text is for {user.name}</P>
```
if we parse the contents to find variable children and name them something reasonable and unique (i.e. camelCase the variable), so the ftl message could look like
```
Scope_descriptionLink = this text is for { $userName }
```
problems with deciding variable names:
 - what if it is a function instead of a variable: `this text is for {_.get(user, 'name')}`
 - what if it is a ternary function instead of a variable: `this text is for {user.prefers_first_name ? user.first : user.last}`
 - what if it is a really long path? `this text is for {this.props.user.data.name.first}`

 the more likely scenario:
```js
<P
  l10nId='Scope_descriptionVariable'
  l10nVars={{name: user.name}}>
  {'this text is for { $name }'}
</P>
```
 

##### adding child react elements in a translated message is confusing
```js
<Localized id='Scope_descriptionLink' anchor={<a href='https://google.com' />}>
  <p>{'this text has a <anchor>link to google</anchor>'}</p>
</Localized>

// could turn into
<P l10nId='Scope_descriptionLink'>this text has <a href='https://google.com'>link to google</a></P>
```
if we parse the contents to find react element children and name them something reasonable and unique (i.e. the element name plus an index number), so the ftl message could look like
```
Scope_descriptionLink = this text has a <a1>link to google</a1>
```

problems with this approach is it hides the fact that there can be no nested children
```js
// allowed
<Localized
    id='BulkCreate_templateDownload'
    glyph={<Glyph glyph='download-sm' styleName='upload-glyph' />}>
    <a
        href={`data:text/plain;charset=utf-8,${this.templateCSV()}`}
        download='uconnect-bulk-sessions-template.csv'>
        {'<glyph></glyph> Download template'}
    </a>
</Localized>

// not allowed
// (although in this example, the anchor could itself be a localized component with the glyph)
<Localized
    id='BulkCreate_templateDownload'
    a={<a href={`data:text/plain;charset=utf-8,${this.templateCSV()}`} download='uconnect-bulk-sessions-template.csv' />}
    glyph={<Glyph glyph='download-sm' styleName='upload-glyph' />}>
    <p>{'click here to <a><glyph></glyph> Download template</a>'}</p>
</Localized>
```

##### there is no 3rd party tool to pull strings automatically
I have started a very hacky implementation of something that "works" in [fluent-react-pull-strings](https://github.com/hkasemir/fluent-react-pull-strings).

it would require a significant amount of clean up, and should hook into the [fluent-syntax](https://github.com/projectfluent/fluent.js/tree/master/fluent-syntax) parser to read, construct, and compare ftl files.

##### it's confusing if I change a string in a component and the ui doesn't update because the ftl file is still the old version
automate checking pullable strings and comparing existing localization ids. When comparing changed messages, have CLI dialogue that would ask whether to update the UI or the locale file.

```
- This is the old message. (en-us.ftl)
+ This is the new text! (components/widget.jsx)

Message ID "Widget_text" is out of date, sync component with ftl
Which message is correct? ([C]omponent (default) / [F]tl):_
```

##### if the locale file changes (i.e. via pontoon) then the jsx contents are out of date
include a task to sync jsx default messages with locale files on app build/serve (ftl file is default)


## Localizer workflow changes
### Pontoon
[Pontoon](https://github.com/mozilla/pontoon) is a Django app that is open source and developed by engineers at mozilla that makes localizing with ftl files pretty awesome. See their [UI for localizers to translate an app in context!](https://pontoon.mozilla.org/)

This is actually pretty easy to get up and running ourselves, with zero issues doing so on private repos.

The only things I think would be blocking:
We might want our instance to require udacity credentials to log in, right now, it will most likely just use the default Django admin authentication.
By default all the strings are publicly viewable, though not editable until you log in with the appropriate permissions, we might want to hide the source strings?
 
Pontoon is not compatible owith json files. In order for our older apps to use it, we need to migrate them off of json source string stores.
> Ensure that your project supports one of the l10n frameworks (gettext, XLIFF, L20n, lang, properties, etc.) [source](https://developer.mozilla.org/en-US/docs/Mozilla/Implementing_Pontoon_in_a_Mozilla_website)