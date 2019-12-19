import { Component, ViewEncapsulation, OnInit } from "@angular/core";
import * as d3 from "d3";

// import * as d3 from 'd3-selection';
import * as d3Scale from "d3-scale";
import * as d3Shape from "d3-shape";
import * as d3Array from "d3-array";
import * as d3Axis from "d3-axis";

import { STOCKS } from "../shared";

@Component({
    selector: "app-line-chart",
    encapsulation: ViewEncapsulation.None,
    templateUrl: "./line-chart.component.html",
    styleUrls: ["./line-chart.component.css"]
})
export class LineChartComponent implements OnInit {
    title = "Line Chart";

    private margin = { top: 20, right: 20, bottom: 30, left: 50 };
    private width: number;
    private height: number;
    private x: any;
    private y: any;
    private svg: any;
    private line: d3Shape.Line<[number, number]>;
    private area;

    private colors: any;

    constructor() {
        this.width = 900 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top - this.margin.bottom;

        // bar colors
        this.colors = d3
            .scaleLinear()
            .domain([0, STOCKS.length])
            .range(<any[]>["red", "blue"]);
    }

    ngOnInit() {
        this.initSvg();
        this.initAxis();
        this.drawAxis();
        this.drawLine();
    }

    private initSvg() {
        this.svg = d3
            .select("svg")
            .append("g")
            .attr(
                "transform",
                "translate(" + this.margin.left + "," + this.margin.top + ")"
            );
    }

    private initAxis() {
        this.x = d3Scale.scaleTime().range([0, this.width]);
        this.y = d3Scale.scaleLinear().range([this.height, 0]);
        this.x.domain(d3Array.extent(STOCKS, d => d.date));
        this.y.domain(d3Array.extent(STOCKS, d => d.value));
    }

    private drawAxis() {
        this.svg
            .append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3Axis.axisBottom(this.x));

        this.svg
            .append("g")
            .attr("class", "axis axis--y")
            .call(d3Axis.axisLeft(this.y))
            .append("text")
            .attr("class", "axis-title")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Price ($)");
    }

    private drawLine() {
        // For Line only
        this.line = d3Shape
            .line()
            .curve(d3Shape.curveCatmullRom)
            .x((d: any) => this.x(d.date))
            .y((d: any) => this.y(d.value));

        this.svg
            .append("path")
            .datum(STOCKS)
            .attr("class", "line")
            .attr("d", this.line);

        // For Filled area
        this.svg
            .append("linearGradient")
            .attr("id", "temperature-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0)
            .attr("y1", this.y(195))
            .attr("x2", 0)
            .attr("y2", this.y(210))
            .selectAll("stop")
            .data([
                { offset: "0%", color: "steelblue" },
                { offset: "50%", color: "gray" },
                { offset: "100%", color: "red" }
            ])
            .enter()
            .append("stop")
            .attr("offset", function(d) {
                return d.offset;
            })
            .attr("stop-color", function(d) {
                return d.color;
            });

        this.area = d3Shape
            .area()
            .curve(d3Shape.curveCatmullRom)
            .x((d: any) => this.x(d.date))
            .y0(this.height)
            .y1((d: any) => this.y(d.value));

        this.svg
            .append("path")
            .datum(STOCKS)
            .attr("class", "area")
            .attr("d", this.area);

        // For Tooltip
        // var tooltip = this.svg
        //     .append("div")
        //     .style("opacity", 0)
        //     .attr("class", "tooltip")
        //     .style("background-color", "white")
        //     .style("border", "solid")
        //     .style("border-width", "2px")
        //     .style("border-radius", "5px")
        //     .style("padding", "5px");

        // var mouseover = function(d) {
        //     tooltip.style("opacity", 1);
        // };
        // var mousemove = function(d) {
        //     tooltip
        //         .html("Exact value: " + d.value)
        //         .style("left", d3.mouse(this)[0] + 70 + "px")
        //         .style("top", d3.mouse(this)[1] + "px");
        // };
        // var mouseleave = function(d) {
        //     tooltip.style("opacity", 0);
        // };

        // For Scatter point
        this.svg
            .selectAll("circle")
            .data(STOCKS)
            .enter()
            .append("circle")
            .attr("cx", (d: any) => this.x(d.date))
            .attr("cy", (d: any) => this.y(d.value))
            .attr("r", 3)
            .on("mouseover", function(d, i) {
                d3.select("svg")
                    .transition()
                    .duration("100")
                    .attr("r", 7);

                //Makes div appear
                div.transition()
                    .duration(100)
                    .style("opacity", 1);
            })
            .on("mouseout", function(d, i) {
                d3.select("svg")
                    .transition()
                    .duration("200")
                    .attr("r", 3);

                //makes div disappear
                div.transition()
                    .duration("200")
                    .style("opacity", 0);
            });

        var div = d3
            .select("svg")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
    }
}
