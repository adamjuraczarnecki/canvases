const canvas = document.querySelector('#main')
// dostosowywanie rozmiaru canvas
const ctx = canvas.getContext("2d");
const clearCanvas = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000'
}
clearCanvas()
// gradient
// Najpierw trzeba stworzyć gradient (podobnie jak swatch w InDesignie).
// Przy rysowaniu liniowych gradintów, potrzebna jest linia.
// Dlatego funkcja createLinearGradient przyjmuje cztery argumenty x i y pierwszego punktu linii oraz x i y drugiego punktu linii. Te wartości powinny są względem całej powierzchni canvas (nie powierzchni rysowanego prostokąta)
var my_gradient = ctx.createLinearGradient(11, 310, 450, 10)
// Następnie określ kolory i ich położenie na wyznaczonej linii (w skali od 0 do 1)
my_gradient.addColorStop(0, '#dcf225')
my_gradient.addColorStop(0.32, '#0ce0ff')
my_gradient.addColorStop(1, '#ff4992')
ctx.fillStyle = my_gradient
ctx.fillRect(10, 10, canvas.width-20, canvas.height-20)