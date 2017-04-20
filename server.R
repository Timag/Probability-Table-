#runApp("C:/Users/d91115/Dropbox/Application/Shiny/Custom_Output_Bindings_Publish/d3_Drag_ProbTablePlusBars", launch.browser = TRUE)
library(shiny)
shinyServer(function(input, output) {
  output$mychart <- renderDragableChart({
    1:16
  })
})
