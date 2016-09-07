
var treeData = [
   
   {
    "name": "Start",
    "parent": "null",
    "class": "start",
    "children": [
      {
        "name": "Redshift",
        "parent": "Start",
        "class": "redshift",
        "children": [
        {
            "name": "Redshift 1",
            "parent": "Redshift",
            "class": "redshift1",
                    "children": [
                    {
                    "name": "Redshift 2",
                    "parent": "Redshift",
                    "class": "redshift2",
                        "children": [
                                    {
                                    "name": "Redshift 3",
                                    "parent": "Redshift",
                                    "class": "redshift3"
                                    }
                        ]
                    }
                    ]
        }
        ]
      },
      {
        "name": "Mysql",
        "parent": "Start",
        "class": "mysql",
        "children": [
          {
            "name": "Mysql 1",
            "parent": "Mysql",
            "class": "mysql1",
                "children": [
                 {
                "name": "Mysql 2",
                "parent": "Redshift 3",
                "class": "mysql2" 
                }
                ]
          }
         ]

      },
       {
        "name": "Kony",
        "parent": "Start",
        "class": "kony",
        "children": [
          {
            "name": "Kony 1",
            "parent": "Kony",
            "class": "kony1"
          }
         ]
      }
    ],
  }

];

// ************** Generate the tree diagram  *****************

var margin = {top: 20, right: 120, bottom: 20, left: 120},
 width = 960 - margin.right - margin.left,
 height = 500 - margin.top - margin.bottom;
 
var i = 0;

var tree = d3.layout.tree()
 .size([height, width]);

var diagonal = d3.svg.diagonal()
 .projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("#tree").append("svg")
 .attr("width", width + margin.right + margin.left)
 .attr("height", height + margin.top + margin.bottom)
  .append("g")
 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 // .on("click", function () {
 //   var r=d3.select(this).node().getBoundingClientRect();
 //   alert( JSON.stringify(  d3.select(this).attr('class') ))
 //   $('#tooltip').css("display", "inline").css("top", (r.top-60) + "px").css("left", "2%");

   //$('#tooltip').style("dy", (r.top-40) + "px")
   //$('#tooltip').style("x", r.left + "px");

   // var r = d3.select(this).node().getBoundingClientRect();
   //  d3.select("div#tooltip")
   //      .style("display", "inline")
   //      .style("top", (r.top-40) + "px")
   //      .style("left", r.left + "px");
        
//var r = d3.select(this).node().getBoundingClientRect();
        //var g = d3.select(this);
     // d3.select("div#tooltip")
     //    .style("display", "inline")
     //    .style("top", (r.top-25) + "px")
     //    .style("left", r.left + "px")
     //    .style("position", "absolute")
     //    .text('test');
      //  alert( JSON.stringify(r));
//})
//.on("mouseout", function(){
     d3.select("div#tooltip").style("display", "none")
  //d3.select(this).select('text.info').remove();
   // d3.select("div#tooltip").style("display", "none")
//});
//root = treeData[0].children[0];
root = treeData[0];
  
update(root);

//update1();

function update(source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
   links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 180; });

  // Declare the nodesâ€¦
  var node = svg.selectAll("g.node")
   .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter the nodes.
  var nodeEnter = node.enter().append("g")
   .attr("class", "node")
   .attr("transform", function(d) { 
    return "translate(" + d.y + "," + d.x + ")"; });

 
  nodeEnter.on("mouseover", function (d) {
    var r = d3.select(this).node().getBoundingClientRect();
    var text=$('text.'+d.class).attr('id');
    $('.popover-content').html(text);
    var t=d3.transform(d3.select(this).attr("transform"));
    var top_tooltip=t.translate[1];
    var left_tooltip=t.translate[0];
    d3.select("div#tooltip")
        .style("display", "inline")
        .style("top", (top_tooltip  - ( top_tooltip * 10/100) ) + "px")
        .style("left", r.left + "px")
        .style("position", "absolute");
        
})
.on("mouseout", function(){
  // d3.select("div#tooltip").style("display", "none")
});
   
   nodeEnter.append("circle")
   .attr("r", 10)
   .attr("class", function(d) { return d.class; })
   .style("fill", "#fff");

   //.attr("r", function(d) { return d.value; })
   //.style("stroke", function(d) { return d.type; })
   //.style("fill", function(d) { return d.level; });

  nodeEnter.append('text')
   .attr("x", function(d) { 
    return d.children || d._children ? -13 : 13; })
   .attr("dy", ".35em")
   .attr("text-anchor", function(d) { 
    return d.children || d._children ? "end" : "start"; })
   .text(function(d) { return d.name; })
   .style("fill-opacity", 1);

   nodeEnter.append('text')
   .attr("class", function(d) {  return "text "+d.class+"" })
   .attr('id' ,"No Result");
  // Declare the linksâ€¦
  var link = svg.selectAll("path.link")
   .data(links, function(d) { return d.target.id; });

  // Enter the links.
  link.enter().insert("path", "g")
  // .attr("class", "link")
      .attr("class", function(d) { return "link "+d.target.class+""; })
      .attr("d", diagonal);
    //.style("stroke", function(d) { return d.target.level; })
   //.attr("d", diagonal);


}
 