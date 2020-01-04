# Law makers, law breakers

![](https://user-images.githubusercontent.com/126868/71761067-af576800-2e94-11ea-94ca-7c0b4ee370de.gif)

**Law makers, law breakers** is a citizen led project that aims to objectively document field evidence of democratic protest against the state and the state’s response to it.

Genuine submissions of unedited videos, photos and objective reporting documenting the protests in India and the world **against [the CAA & NRC](ABOUT_CAA_NRC.md)** are solicited from the public and curated as per the [content policy](https://github.com/kshivanku/CAAProtests/wiki/Content-policy).


# Contributing

Volunteers are invited to contribute to any of the following tasks:

- Content curation and fact checking
- Site UX and design
- Web development

Get in touch on twitter [@mycountryawake](https://twitter.com/mycountryawake) or email `anticaanrcdata@gmail.com` or directly [report an issue](https://github.com/kshivanku/CAAProtests/issues)


## Development

The app is built using create-react-app, has a firebase database and deployed on Heroku. See the [project wall](https://github.com/kshivanku/CAAProtests/projects/1) for issues to work on.

Clone and run the following to start the express server:

    git clone https://github.com/kshivanku/CAAProtests.git
    cd CAAProtests
    npm install
    npm run

Start the client server in a new terminal tab

    cd client
    npm install
    npm run
    
# Data

All content submissions go into a firebase database and fact checked for authenticity by volunteers in a [google spreadsheet](https://docs.google.com/spreadsheets/d/e/2PACX-1vQPGGA0BSZFo29GSABgiO1pGYvKA0ON4cVh5YaaMSiYqAZHHE-83rxzUmQwpSKRXdA68KSTYpKadpVU/pubhtml?gid=0&single=true).

The sheet is queried via [tapletop](https://www.npmjs.com/package/tabletop) and made available to the app as a JSON API: http://caaprotests.info/getVideoData

# Copyright

The previewed content is copyrighted by the original authors. No other copyright is claimed on any other content of the website.

The project code is released under MIT license.
