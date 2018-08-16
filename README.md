### Test Specs Helper
While working on test specs for [Recognizers-Text](https://github.com/Microsoft/Recognizers-Text), I found out that it is a lot of work to change everything by hand. That's why I wrote a small CLI tool which can help with changing the structure in batch.

## Requirements
* NodeJS 8+

## How to use?
Clone this repository
`git clone https://github.com/iMicknl/test-specs-helper`

Install the extension globally
`npm install -g`

Open the folder containing the JSON test spec
`cd folder_path`
`tsh` (run test specs helper)

A new `output` folder will be created within the directory. You can now review the changes and manually copy them into the original folder.

## Contribute?
* I made a begin with a batch translating option for Google Translate + Bing Translate, feel free to contribute. 
* I made a start with supporting the passing of variables to the command.


## License
MIT