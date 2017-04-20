library(shiny)

dataSelect <- reactiveValues(type = "all")

# To be called from ui.R
DragableChartOutput <- function(inputId, width="600px", height="600px") {
  style <- sprintf("width: %s; height: %s;",
    validateCssUnit(width), validateCssUnit(height))
  tagList(
    tags$script(src = "d3.v3.min.js"),
    tags$script(src = "d3.v3.js"),     
    includeScript("ChartRendering.js"),
    includeScript("bars.css"),
    div(id=inputId, class="Dragable", style = style,
      tag("svg", list())
    )
  )
}

# To be called from server.R
renderDragableChart <- function(expr, env = parent.frame(), quoted = FALSE, color = "orange", r = 10) {
  installExprFunction(expr, "data", env, quoted)
  function(){
    data()
    #list(data = data, col = color)
  } 
}