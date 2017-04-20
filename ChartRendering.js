
// Declare variables for R input
var col = "orange";
var coord = [];

// bind the output
var binding = new Shiny.OutputBinding();

binding.find = function(scope) {
  return $(scope).find(".Dragable");
};

binding.renderValue = function(el, data) {
			var w = 200;
			var h = 200;
			var barPadding = 1;
			var counter = -1;
			var xcounter = -1;
			var xcounterval = 0;			
			var fullRow = [];			
			var fullCol = [];
			var fullMat = [];
			
			// R Data Input
			dataset = data;
			dataSelect = d3.merge([dataset[0], dataset[2], dataset[3], dataset[1]])				
			sqrt = function(sqr){
				var result = 0;				
				d3.range(1, (sqr + 1)).forEach(function(entry) {
					if(entry*entry == sqr) result = entry
				})
				return result
			}
			
			// function to add row-col and total sum to the dataset matrix
			ProbTable = function(dataset){
				var dim = sqrt(dataset.length);
				d3.range(0, dim).forEach(function(entry) {
					fullCol = []
					d3.range(0, dim).forEach(function(entry2) {
						fullCol = d3.merge([fullCol, dataset[entry2 + entry*dim]])
					})
					fullMat = d3.merge([fullMat, fullCol, d3.sum(fullCol)])
				})
				d3.range(0, dim).forEach(function(entry) {
					fullRow = [];
					d3.range(0, dim).forEach(function(entry2) {
						fullRow = d3.merge([fullRow, dataset[entry + entry2*dim]])
					})
					fullMat = d3.merge([fullMat, d3.sum(fullRow)])
				})
				return(d3.merge([fullMat, d3.sum(dataset)]))
			}
			dataset = ProbTable(dataset)
						
			// create a HTML table to position the col/rownames correctly
            var $el = $(el);
			var table = d3.select(el) 
				.append("table")
				.attr("width", 300)
				.attr("height",200)
			var tr1 = table.append("tr")
			var td11 = tr1.append("td")
			var td12 = tr1.append("td")
			var svgText = td12
						.append("svg")
						.attr("width", 200)
						.attr("height", 30)
                        
            // Create row and column labels of table
            var dim = sqrt(dataset.length);
			// create default text for row labels
			var rowLabels = []
			var colLabels = []
            
            for (var i = 1; i < dim; i++) {
                colLabels.push("Col " + i);
                rowLabels.push("Col " + i);                
            }            
            colLabels.push("totals")
            rowLabels.push("totals")

			svgText.selectAll("rect")						
			   .data(colLabels)
			   .enter()
			   .append("text")
			   .text(function(d, i) {				
			   		return d;
			   })			   
			   .attr("x", function(d, i) {
					return i*w/dim + w/dim/2 - w/20
			   })
			   .attr("y", function(d, i) {
					return 20;			   		
			   })
			   .attr("font-family", "sans-serif")
			   .attr("font-size", 9 + "px")
			   .attr("fill", "black")
			
            
            
            
			var tr2 = table.append("tr")
			var td21 = tr2.append("td")
			var svgText = td21
						.append("svg")
						.attr("width", w/4)
						.attr("height", h)
			svgText.selectAll("rect")
			   .data(rowLabels)
			   .enter()
			   .append("text")
			   .text(function(d, i) {				
			   		return d;
			   })			   
			   .attr("x", function(d, i) {
					return 2
			   })
			   .attr("y", function(d, i) {
					return (i+1)*h/dim - w/dim/2 + w/20;			   		
			   })
			   .attr("font-family", "sans-serif")
			   .attr("font-size", 9 + "px")
			   .attr("fill", "black") 
			/*

			   */

			// Create the table
			var rowBorder = []
			var columnBorder = []			
			var dimRange = d3.range(1, dim);
			dimRange.forEach(function(entry) {
				columnBorder = d3.merge([columnBorder, [entry*dim]]);
				rowBorder = d3.merge([rowBorder, [dim*dim - entry]]);
			});
			
			var borderValues = d3.merge([rowBorder, columnBorder, dim*dim])
			match = function(matcher, ary){
				var found = false;
				ary.forEach(function(entry) {	
					if(entry == matcher){
						found =  true
					}
				});	
				return found
			}
			
			var totalSum = dataset[(dataset.length - 1)];
			var denumenator = totalSum;
			var denumerArrayInit = [];
			dataset.forEach(function(entry, i) {
				denumerArrayInit[i] = (dataset.length - 1);
			});
			var denumerArray = denumerArrayInit;
			
			//Create SVG element
			var td22 = tr2.append("td")
			var svg = td22
						.append("svg")
						.attr("width", w)
						.attr("height", h);
			d3.select("body").selectAll("div")
			svg.selectAll("rect")
			   .data(dataset)
			   .enter()
			   .append("rect")
			   .attr("x", function(d, i) {
					xcounter += 1;
					if(xcounter > (dim - 1)){
						xcounter = 0
						xcounterval +=1
					}
					return xcounterval*w/dim;
			   })

			   .attr("y", function(d, i) {
					counter += 1;
					if(counter > (dim - 1)) counter = 0 
					return counter*h/dim;			   		
			   })
			   .attr("width", w/dim - barPadding)
			   .attr("height", function(d,i) {
			   		return h/dim - barPadding;
			   })
			   .attr("fill", function(d) {
					return "rgb(0, 0, " + (d * 10) + ")";
			   })
			   .on("mouseover", mouseover)
			   .on("mouseout", mouseout)
			   .on("click", clicked)
			   function clicked(d, i){
					if(match((i+1), borderValues)){
					  dataSelect = [];
						// change color					
						var rectSelect = svg.select("rect:nth-child(" + (i + 1) + ")");
						rectSelect.attr("fill", "rgb(200, 0, " + (d * 10) + ")")
						// change denumenator for inner values
                        
                        // if column border is click
						if(match(i + 1, columnBorder)){
							dimRange.forEach(function(entry) {
								denumerArray[(i - entry)] = i
								var rectSelect = svg.select("rect:nth-child(" + ((i - entry) + 1) + ")");
								rectSelect.attr("fill", "rgb(200, 0, " + (d * 10) + ")");
								dataSelect = d3.merge([dataSelect, dataset[((i - entry) + 1)]])
							})
                        // if row border is click                            
						}else if(match(i + 1, rowBorder)){
							dimRange.forEach(function(entry) {
								denumerArray[(i - entry*dim)] = i
								var rectSelect = svg.select("rect:nth-child(" + ((i - entry*dim) + 1) + ")");
								rectSelect.attr("fill", "rgb(200, 0, " + (d * 10) + ")");
								dataSelect = d3.merge([dataSelect, dataset[((i - entry) + 1)]])
							})
                        // if lower right hand rectangle is clicked then take it as denumerator
						}else if((i + 1) == dataset.length){
							denumerArray.forEach(function(entry, idx) {
								denumerArray[idx] = denumerArray.length -1
								var rectSelect = svg.select("rect:nth-child(" + (i + 1) + ")");
								rectSelect.attr("fill", "rgb(200, 0, " + (d * 10) + ")");
								dataSelect = d3.merge([dataSelect, dataset[(i + 1)]])
							})
						}
					}
			   }
   			   function mouseover(d, i){
					// change color of mouseover cell					
					var rectSelect = svg.select("rect:nth-child(" + (i + 1) + ")");
					rectSelect.attr("fill", "rgb(200, 200, " + (d * 10) + ")");

					// change color of denumerator cell					
					var rectSelect = svg.select("rect:nth-child(" + (denumerArray[i] + 1) + ")");
					rectSelect.attr("fill", "rgb(200, 200, " + (d * 10) + ")");
					
					// change text
					var index = i
					svg.selectAll("text")
						.text(function(d, i) {
							if(i == index){
								if(match((i+1), borderValues)){
									return Math.round(d/totalSum*100) + "%"
								}else{								  
									return Math.round(d/dataset[denumerArray[i]]*100) + "%"
								}
							}else{					
								return d;	
							}
						})	
				}
				
				function mouseout(d, i){
						// change color
						var rectSelect = svg.selectAll("rect")						
							.attr("fill", function(dataset) {
								return "rgb(0, 0, " + (dataset * 10) + ")";
							})
						
						// change text
						svg.selectAll("text")
						.text(function(d, i) {					
								return d;	
						})				
				}			

		// create default text for cell labels, give the position
		// attributes with "x" and "y" and give them the same 
		// mouseover/out and click attributes as the corresponding
		// rectangles 
		counter = -1;
		xcounter = -1;
		xcounterval = 0;			
		var svgText = svg.selectAll("text")
			   .data(dataset)
			   .enter()
			   .append("text")
			   .text(function(d, i) {				
			   		return d;
			   })
			   .attr("x", function(d, i) {
					xcounter += 1;
					if(xcounter > (dim - 1)){
						xcounter = 0
						xcounterval += 1
					}
					return xcounterval*w/dim + w/dim/2 - w/20;
			   })
			   .attr("y", function(d, i) {
					counter += 1;
					if(counter > (dim - 1)) counter = 0 			
					return (counter+1)*h/dim - w/dim/2 + w/20;			   		
			   })
			   .attr("font-family", "sans-serif")
			   .attr("font-size", 60/dim + "px")
			   .attr("fill", "white")
			   .on("mouseover",mouseover)
			   .on("mouseout",mouseout)
			   .on("click", clicked)
			   


};

// Regsiter new Shiny binding
Shiny.outputBindings.register(binding, "shiny.Dragable");


