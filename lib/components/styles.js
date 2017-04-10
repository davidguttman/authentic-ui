var csjs = require('csjs')
var insert = require('insert-css')

var styles = module.exports = csjs`
  .disabled {
    opacity: 0.5;
  }

  .box {
    background: #fff;
    font-family: sans-serif;
    font-size: 16px;
    padding: 15px 50px 30px;
    border-radius: 2px;
    width: 400px;
    margin: 100px auto 50px;
    text-align: center;
    box-shadow: rgba(0, 0, 0, 0.247059) 0px 14px 45px, rgba(0, 0, 0, 0.219608) 0px 10px 18px;
  }

  .input {
    width: 100%;
    height: 36px;
    outline: none;
    font-size: 16px;
    font-weight: 100;
    line-height: 24px;
    border-width: 0px 0px 1px;
    border-bottom-style: solid;
    border-bottom-color: #eee;
    margin-bottom: 16px;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  .error {
    margin: 20px;
    color: #f00;
  }

  .submit {
    color: #fff;
    background-color: #a551e1;
    width: 100%;
    padding: 0px 16px;
    font-size: 14px;
    font-weight: 500;
    line-height: 36px;
    letter-spacing: 0px;
    text-transform: uppercase;
    text-decoration: none;
    cursor: pointer;
    outline: none;
    overflow: hidden;
    border: 0px;
    border-radius: 2px;
    box-shadow: rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.239216) 0px 1px 4px;
    user-select: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-appearance: button;
  }

  .links {
    margin-top: 20px;
    color: #aaa;
  }

  .link {
    color: #aaa;
    font-weight: 100;
  }
`

insert(csjs.getCss(styles))
