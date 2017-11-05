import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { StorageService } from '../../storage.service';
import { CalculationsService } from '../../calculations.service';
import { RunLog } from "../../run-log"
import { RunGoal } from "../../run-goal"
import { RunGoalGraph } from "../../run-goal-graph"
import * as D3 from "d3";
import { event as currentEvent } from 'd3-selection';
import * as moment from "moment";
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-vo2-max',
  templateUrl: './vo2-max.component.html',
  styleUrls: ['./vo2-max.component.css']
})

export class VO2MaxComponent implements AfterViewInit {

  constructor(private storage: StorageService, private runCalc: CalculationsService) {

    var s: CalculationsService = new CalculationsService;
  }

  @ViewChild('container') element: ElementRef;
  @ViewChild('tooltip') tooltip: ElementRef;

  private host;
  private svg;
  private margin;
  private width;
  private height;
  private xScale;
  private yScale;
  private xAxis;
  private yAxis;
  private tooltipX;
  private tooltipY;
  private goals: RunGoal[];
  private graphGoals: RunGoalGraph[];
  private legendData: RunGoalGraph[];
  private colors: string[];
  private logs: RunLog[];
  private selectedGoal: RunGoal;
  private combined: RunGoal[] = new Array<RunGoal>();
  private htmlElement: HTMLElement;
  private tooltipElement: HTMLElement;
  private CSS_COLOR_NAMES = ["AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", "Beige", "Bisque", "Black", "BlanchedAlmond", "Blue", "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson", "Cyan", "DarkBlue", "DarkCyan", "DarkGoldenRod", "DarkGray", "DarkGrey", "DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen", "Darkorange", "DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue", "DarkSlateGray", "DarkSlateGrey", "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray", "DimGrey", "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "GoldenRod", "Gray", "Grey", "Green", "GreenYellow", "HoneyDew", "HotPink", "IndianRed", "Indigo", "Ivory", "Khaki", "Lavender", "LavenderBlush", "LawnGreen", "LemonChiffon", "LightBlue", "LightCoral", "LightCyan", "LightGoldenRodYellow", "LightGray", "LightGrey", "LightGreen", "LightPink", "LightSalmon", "LightSeaGreen", "LightSkyBlue", "LightSlateGray", "LightSlateGrey", "LightSteelBlue", "LightYellow", "Lime", "LimeGreen", "Linen", "Magenta", "Maroon", "MediumAquaMarine", "MediumBlue", "MediumOrchid", "MediumPurple", "MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise", "MediumVioletRed", "MidnightBlue", "MintCream", "MistyRose", "Moccasin", "NavajoWhite", "Navy", "OldLace", "Olive", "OliveDrab", "Orange", "OrangeRed", "Orchid", "PaleGoldenRod", "PaleGreen", "PaleTurquoise", "PaleVioletRed", "PapayaWhip", "PeachPuff", "Peru", "Pink", "Plum", "PowderBlue", "Purple", "Red", "RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon", "SandyBrown", "SeaGreen", "SeaShell", "Sienna", "Silver", "SkyBlue", "SlateBlue", "SlateGray", "SlateGrey", "Snow", "SpringGreen", "SteelBlue", "Tan", "Teal", "Thistle", "Tomato", "Turquoise", "Violet", "Wheat", "White", "WhiteSmoke", "Yellow", "YellowGreen"];
  ngAfterViewInit() {
    this.htmlElement = this.element.nativeElement;
    this.tooltipElement = this.tooltip.nativeElement;
    this.host = D3.select(this.htmlElement);
    this.setup();
  }

  ngOnChanges(): void {
    this.setup();
  }

  onCurveChange(curve: string) {
    this.setup();
  }

  private setup(): void {
    this.margin = { top: 20, right: 20, bottom: 30, left: 50 };
    this.width = 960 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
    this.xScale = D3.scaleTime().range([0, this.width]);
    this.yScale = D3.scaleLinear().range([this.height, 0]);
    this.storage.getRunGoals((err, doc) => {
      this.goals = doc;
      this.goals.every(x => x.active = true);
      this.goals.map((x) => x.vo2Max = this.runCalc.VO2Max(x));
      this.goals.sort((a: RunGoal, b: RunGoal) => {
        var momentA = moment(a.date);
        var momentB = moment(b.date);
        if (momentA < momentB) {
          return -1;
        }
        if (momentA > momentB) {
          return 1;
        }
        return 0;
      })
      var totalLines = this.goals.length + 2;
      this.colors = this.getColorsArray(totalLines);
      this.buildChartData();
      this.buildChart();
    });
    this.storage.getRunLogs((err, doc) => {
      this.logs = doc;
      this.logs.every(x => x.active = true);
      this.logs.map((x) => x.vo2Max = this.runCalc.VO2Max(x));
      this.logs.sort((a: RunLog, b: RunLog) => {
        var momentA = moment(a.date);
        var momentB = moment(b.date);
        if (momentA < momentB) {
          return -1;
        }
        if (momentA > momentB) {
          return 1;
        }
        return 0;
      })
      this.buildChartData();
      this.buildChart();
    });
  }
  private toggleActive(goal: RunGoalGraph) {
    var toggleGoal = this.graphGoals[this.graphGoals.indexOf(goal)];
    toggleGoal.active = !toggleGoal.active;
    var svg = this.host.select('svg');
    svg.remove();
    this.buildChart();
  }
  private setHover(goal: RunGoal) {
    var toggleGoal = this.goals.find(x => x.distance == goal.distance && x.date == goal.date && x.duration == goal.duration);
    if (toggleGoal) {
      toggleGoal.active = !goal.active;
    }
    var svg = this.host.select('svg');
    svg.remove();
    this.buildChartData();
    this.buildChart();
  }

  private buildChartData() {
    if (!this.goals || !this.logs) {
      return;
    }
    this.legendData = new Array<RunGoalGraph>();
    this.graphGoals = new Array<RunGoalGraph>();

    this.goals.forEach((goal) => {
      var progressToGoal = new Array<RunGoal>();
      progressToGoal.push(this.logs[0]);
      progressToGoal.push(goal);
      var graphGoal = new RunGoalGraph();
      graphGoal.active = true;
      graphGoal.goals = progressToGoal;
      this.graphGoals.push(graphGoal);
    });
    //this.logs[this.logs.length - 1].tags = new Array();
    var logGraph = new RunGoalGraph();
    logGraph.goals = this.logs;
    logGraph.active = true;
    this.graphGoals.push(logGraph);

    this.graphGoals.forEach((d) => {
      this.legendData.push(d);
    })
    var activeGoals = this.goals.filter(x => x.active);
    var maxDate = activeGoals[activeGoals.length - 1].date;
    this.graphGoals.push(this.runCalc.GetTrendLine(logGraph, maxDate));
  }

  private buildChart() {
    if (!this.graphGoals) {
      return;
    }
    var totalLines = this.goals.length + 2;
    var colors = this.getColorsArray(totalLines);
    this.graphGoals.forEach((x, i) => {
      x.color = colors[i];
    })
    let calc = this.runCalc;
    let getText = this.getText;
    var graphGoals = this.graphGoals;
    var activeGraphs = this.getActiveGoals(this.graphGoals)
    var legendData = this.legendData;

    var w = 1250;
    var h = 600;
    var padding = 50;

    // Define axis ranges & scales        
    var yExtents = D3.extent(D3.merge(activeGraphs), function (d: RunGoal) { return d.vo2Max });
    var xExtents = D3.extent(D3.merge(activeGraphs), function (d: RunGoal) { return new Date(d.date); });

    var xScale = D3.scaleTime()
      .domain([xExtents[0], xExtents[1]])
      .range([padding, w - padding * 2 - 300]);

    var yScale = D3.scaleLinear()
      .domain([0, yExtents[1]])
      .range([h - padding, padding]);

    var graphSvg = this.host
      .append("svg")
      .attr("width", w - 300)
      .attr("height", h);
    // Define lines
    var line = D3.line<RunGoal[]>()
      .curve(D3.curveLinear)
      .x(function (d, i) { return xFunc(d, i) })
      .y(function (d, i) { return yFunc(d, i) })

    var xFunc = function (d, i) {
      return xScale(new Date(d.date));
    }
    var yFunc = function (d, i) {
      return yScale(d.vo2Max);
    }

    var pathContainers = graphSvg.selectAll('g')
      .data(graphGoals.filter(x => x.active))
      .enter()
      .append('g')
      .attr('stroke', function (d) { return d.color })
      //.attr('fill', function (d) { return d.color })
      .append('path')
      .attr('d', function (d) { return line(d.goals) })
      .style("stroke-dasharray", function (d) {
        if (d.projection) {
          return ("3,3")
        }
        return null;
      })
      .attr('class', 'line');


    // add circles
    graphSvg.selectAll('g')
      .data(graphGoals.filter(x => x.active))
      .selectAll('circle')
      .data(function (d) { return d.goals; })
      .enter().append('circle')
      .attr('class', 'circle')
      .on("mouseover", (d, i) => this.handleMouseOver(d, i))
      .on("mouseout", (d, i) => this.handleMouseOut(d, i))
      .on("click", (d, i) => this.showToolTip(d))
      .attr('cx', function (d) { return xScale(new Date(d.date)); })
      .attr('cy', function (d) { return yScale(d.vo2Max); })
      .attr('r', 3);

    //Define X axis
    var xAxis = D3.axisBottom(xScale)
      .ticks(5);

    //Define Y axis
    var yAxis = D3.axisLeft(yScale)
      .ticks(5);

    //Add X axis
    graphSvg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + (h - padding) + ")")
      .call(xAxis);

    //Add Y axis
    graphSvg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + padding + ",0)")
      .call(yAxis);

    // Add title	  
    graphSvg.append("svg:text")
      .attr("class", "title")
      .attr("x", 20)
      .attr("y", 20)
      .text("Fruit Sold Per Hour");
  }
  handleMouseOver(d, i) {
    var element = D3.select(event.srcElement);
    element.transition()
      .duration(250)
      .attr('stroke-opacity', '.5')
      .attr('stroke-width', '20px');
  }
  handleMouseOut(d, i) {
    // Use D3 to select element, change color back to normal
    var element = D3.select(event.srcElement)
    element.transition()
      .duration(250)
      .attr('stroke-width', 2);
  }
  getColorsArray(total) {
    var i = 360 / (total - 1); // distribute the colors evenly on the hue range
    var r = []; // hold the generated colors
    for (var x = 0; x < total; x++) {
      r.push(this.rgb(this.hsvToRgb(i * x, 100, 100))); // you can also alternate the saturation and value for even more contrast between the colors
    }
    return r;
  }
  /**
 * HSV to RGB color conversion
 *
 * H runs from 0 to 360 degrees
 * S and V run from 0 to 100
 * 
 * Ported from the excellent java algorithm by Eugene Vishnevsky at:
 * http://www.cs.rit.edu/~ncs/color/t_convert.html
 */
  hsvToRgb(h, s, v) {
    var r, g, b;
    var i;
    var f, p, q, t;

    // Make sure our arguments stay in-range
    h = Math.max(0, Math.min(360, h));
    s = Math.max(0, Math.min(100, s));
    v = Math.max(0, Math.min(100, v));

    // We accept saturation and value arguments from 0 to 100 because that's
    // how Photoshop represents those values. Internally, however, the
    // saturation and value are calculated from a range of 0 to 1. We make
    // That conversion here.
    s /= 100;
    v /= 100;

    if (s == 0) {
      // Achromatic (grey)
      r = g = b = v;
      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    h /= 60; // sector 0 to 5
    i = Math.floor(h);
    f = h - i; // factorial part of h
    p = v * (1 - s);
    q = v * (1 - s * f);
    t = v * (1 - s * (1 - f));

    switch (i) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;

      case 1:
        r = q;
        g = v;
        b = p;
        break;

      case 2:
        r = p;
        g = v;
        b = t;
        break;

      case 3:
        r = p;
        g = q;
        b = v;
        break;

      case 4:
        r = t;
        g = p;
        b = v;
        break;

      default: // case 5:
        r = v;
        g = p;
        b = q;
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }
  rgb(rgb) {
    return "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
  }
  getText(d: any, i) {
    return d.tags ? "RunLog" : "Goal: " + moment(d.date).format("MM-DD-YYYY") + " distance: " + d.distance;
  }
  getActiveGoals(graphGoals: RunGoalGraph[]): RunGoal[][] {
    var goals = graphGoals.map(x => { return x.goals })
    var activeGraphs = goals.filter(x => x[x.length - 1].active);
    return activeGraphs;
  }
  showToolTip(d: RunGoal) {
    D3.select(this.tooltipElement)
      .style('opacity', 1);

    D3.select(this.tooltipElement)
      .transition()
      .delay(10000)
      .duration(100)
      .style('opacity', 0);

    this.tooltipX = event["clientX"];
    this.tooltipY = event["clientY"];
    this.selectedGoal = d;
  }
  hideToolTip() {
    D3.select(this.tooltipElement)
      .style('opacity', 0);
  }
}