import {Component, DefineMap} from "can";
import view from "~/app.stache";


import "./layout.css";

import img from "./assets/medicalpad-logo.png";

const ViewModel = DefineMap.extend({
  message: {
    default: `This is the component ${img}`
  },
  foo: function (page) {
    import( /* webpackChunkName: "log" */
      "./log").then(({default: foo}) => {
      console.log(foo());
    });
    import(
      /* webpackInclude: /\.js$/ */
      /* webpackExclude: /\-test\.js$/ */
      /* webpackChunkName: "page" */
      /* webpackMode: "lazy" */
      `~/pages/${page}`).then(({default: page}) => {
      console.log(page);
    });
  }
});


Component.extend({
  tag: "x-app",
  ViewModel,
  view
});