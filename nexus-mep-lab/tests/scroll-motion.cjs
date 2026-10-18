'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
let reduced=false,played=0,cancelled=0,observer;
const surface={animate(){played++;return{cancel(){cancelled++}}},querySelectorAll(){return[]}};
const c=vm.createContext({window:{matchMedia:()=>({matches:reduced})},document:{getElementById:()=>surface}});
vm.runInContext(html.slice(html.indexOf('let modulePageRoute='),html.indexOf('function refineDataTables(')),c);
const run=code=>vm.runInContext(code,c);
run("animateModulePage('a')");assert.equal(played,0);run("animateModulePage('b')");assert.equal(played,1);run("animateModulePage('b')");assert.equal(played,1);reduced=true;run("animateModulePage('c')");assert.equal(played,1);assert.equal(cancelled,1);
function node(top){const classes=new Set();return{querySelector:()=>null,parentElement:{closest:()=>null},getBoundingClientRect:()=>({top}),classList:{add:x=>classes.add(x),remove:x=>classes.delete(x),contains:x=>classes.has(x)}};}
const visible=node(100),below=node(1200),nodes=[visible,below];
const s=vm.createContext({window:{innerHeight:800,matchMedia:()=>({matches:reduced})},document:{getElementById:()=>({querySelectorAll:()=>nodes})},IntersectionObserver:class{constructor(fn,options){this.fn=fn;this.options=options;this.observed=[];observer=this}observe(n){this.observed.push(n)}unobserve(){}disconnect(){}}});
vm.runInContext(html.slice(html.indexOf('let pageRevealObserver='),html.indexOf('let scrollChromeFrame=')),s);
vm.runInContext('startPageScrollMotion()',s);assert.equal(observer,undefined,'reduce motion bypasses observer');
reduced=false;vm.runInContext('startPageScrollMotion()',s);assert.equal(observer.observed.length,1);assert(!visible.classList.contains('scroll-await'));assert(below.classList.contains('scroll-await'));
observer.fn([{target:below,isIntersecting:true}]);assert(!below.classList.contains('scroll-await'),'revealed cards remain visible');
vm.runInContext("window.matchMedia=query=>({matches:query.includes('max-width')?true:false});startPageScrollMotion()",s);assert.equal(observer.options.threshold,.01,'phone cards reveal before large sections fill viewport');assert.equal(observer.observed.length,1);observer.fn([{target:below,isIntersecting:true}]);assert(!below.classList.contains('scroll-await'));
console.log('PASS interaction 3.0: first visit, route-only animation, interruption, reduced-motion fallback and one-time viewport reveal');
