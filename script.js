var canvas = document.getElementById("canvas");
var canvas2 = document.getElementById("canvas2");
var canvas3 = document.getElementById("canvas3");
var ctx = canvas.getContext("2d");
var ctx2 = canvas2.getContext("2d");
var ctx3 = canvas3.getContext("2d");
var img = new Image();
var isDragging = false;
var offsetX = 0;
var offsetY = 0;
var lastPosX = 0;
var lastPosY = 0;
var images = [];
var isDragging = false;
var dragIndex = -1;
var savedImageData = null;
var canvasState = [];
let clickedText;
var selectedImage;
var image;

var canvasInitialized = false; // esta variable se establece en true la primera vez que se llama a loadImage()

function loadImage() {
  var fileInput = document.getElementById("imageLoader");
  var file = fileInput.files[0];
  var reader = new FileReader();

  reader.onload = function(e) {
    var img = new Image();
    img.onload = function() {
      var maxWidth = canvas2.clientWidth;
      var maxHeight = canvas2.clientHeight;
      var width = img.width;
      var height = img.height;

      var maxImageWidth = maxWidth * 0.6;
      var maxImageHeight = maxHeight * 0.6;

      if (width > maxImageWidth) {
        height *= maxImageWidth / width;
        width = maxImageWidth;
      }

      if (height > maxImageHeight) {
        width *= maxImageHeight / height;
        height = maxImageHeight;
      }

      images.push({img: img, x: 0, y: 0, w: width, h: height, isDragging: false});
      if (!canvasInitialized) { // solo reinicia el canvas si no ha sido inicializado antes
        canvas2.width = maxWidth;
        canvas2.height = maxHeight;
        canvasInitialized = true;
      }

      drawImages();

      var resizeIndex = -1;
var isResizing = false;
var offsetX2, offsetY2;

canvas2.addEventListener("mousedown", function(e) {
  var mouseX = e.pageX - this.offsetLeft;
  var mouseY = e.pageY - this.offsetTop;

  // Check if mouse is in the corner of an image
  for (var i = images.length - 1; i >= 0; i--) {
    var image = images[i];
    if (mouseX < image.x + image.w && mouseX > image.x + image.w - 20 && mouseY < image.y + image.h && mouseY > image.y + image.h - 10) {
      isResizing = true;
      resizeIndex = i;
      offsetX2 = mouseX - (image.x + image.w);
      offsetY2 = mouseY - (image.y + image.h);
      break;
    }
  }

  // If not resizing, check if mouse is in the body of an image
  if (!isResizing) {
    for (var i = images.length - 1; i >= 0; i--) {
      var image = images[i];
      if (mouseX < image.x + image.w && mouseX > image.x && mouseY < image.y + image.h && mouseY > image.y) {
        image.isDragging = true;
        isDragging = true;
        dragIndex = i;
        offsetX = mouseX - image.x;
        offsetY = mouseY - image.y;
        break;
      }
    }
  }
});

canvas2.addEventListener("mousemove", function(e) {
  var mouseX = e.pageX - this.offsetLeft;
  var mouseY = e.pageY - this.offsetTop;

  // If resizing, adjust size of image
  if (isResizing) {
    var image = images[resizeIndex];
    var aspectRatio = image.originalWidth / image.originalHeight;
    if (mouseX - image.x + offsetX2 > mouseY - image.y + offsetY2) {
      var newWidth = mouseX - image.x + offsetX2;
      var newHeight = newWidth / aspectRatio;
    } else {
      var newHeight = mouseY - image.y + offsetY2;
      var newWidth = newHeight * aspectRatio;
    }
    if (newWidth > 0 && newHeight > 0) {
      image.w = newWidth;
      image.h = newHeight;
      drawImages();
    }
  }
  
  // If dragging, adjust position of image
  if (isDragging) {
     image = images[dragIndex];
    image.x = mouseX - offsetX;
    image.y = mouseY - offsetY;
    drawImages();
  }
});

// Add originalWidth and originalHeight to each image object
images.forEach(function(image) {
  image.originalWidth = image.w;
  image.originalHeight = image.h;
});

canvas2.addEventListener("mouseup", function() {
  isDragging = false;
  isResizing = false;
  if (dragIndex !== -1) {
    images[dragIndex].isDragging = false;
  }
});

    }

    img.src = e.target.result;
  }

  reader.readAsDataURL(file);
}

function drawImages() {
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  
  images.forEach(function(image) {
    ctx2.drawImage(image.img, image.x, image.y, image.w, image.h);
    if (image.isSelected) {
      ctx2.lineWidth = 3;
      ctx2.strokeStyle = "#0086FD";
      ctx2.strokeRect(image.x, image.y, image.w, image.h);
      ctx2.beginPath();
      ctx2.arc(image.x + image.w, image.y + image.h, 5, 0, 2 * Math.PI);
      //ctx2.fillStyle = "white";
      ctx2.strokeStyle = "#0086FD";
      ctx2.fillStyle = "#0086FD";
      ctx2.fill();
      ctx2.stroke();
      
    }
    // Dibujar el recuadro de selección si la imagen está seleccionada
    /*if (image.isSelected) {
      ctx2.lineWidth = 3;
      ctx2.strokeStyle = "red";
      ctx2.strokeRect(image.x, image.y, image.w, image.h);
    }*/
  });

  
  
  texts.forEach(function(text) {
    ctx2.font = text.fontSize + "px " + text.font;
    ctx2.fillStyle = "black"
    var textWidth = ctx2.measureText(text.text).width;
    text.w = textWidth;
    text.h = text.fontSize * 1.2;
    ctx2.fillText(text.text, text.x, text.y + text.h);
    if (selectedText && text === selectedText) {
      ctx2.lineWidth = 2;
      ctx2.strokeStyle = "#0086FD";
      ctx2.strokeRect(text.x, text.y, text.w, text.h);
      ctx2.beginPath();
      ctx2.beginPath();
  ctx2.arc(text.x + text.w, text.y + text.h, 5, 0, 2 * Math.PI);
    ctx2.fillStyle = "#0086FD";
    ctx2.fill();
    ctx2.stroke();
      
    }
  });
}

canvas2.addEventListener("click", function(e) {
  var mouseX = e.pageX - this.offsetLeft;
  var mouseY = e.pageY - this.offsetTop;
   selectedImage = null;

  // Deseleccionar todas las imágenes
  images.forEach(function(image) {
    image.isSelected = false;
  });

  // Seleccionar la imagen que se hizo clic
  for (var i = images.length - 1; i >= 0; i--) {
    var image = images[i];
    if (mouseX < image.x + image.w && mouseX > image.x && mouseY < image.y + image.h && mouseY > image.y) {
      image.isSelected = true;
      selectedImage = image;
      break;
    }
  }

  drawImages();

  // Cambiar la posición de la imagen seleccionada al final del array para que se dibuje encima de las otras
  if (selectedImage) {
    images.splice(images.indexOf(selectedImage), 1);
    images.push(selectedImage);
  }
});


// ---------------------------
var edicion = true;
console.log(edicion);
document.getElementById("brush").addEventListener("click", () => {

  
    if(edicion == false){
      edicion = true;
      console.log("Activando edición");
      document.getElementById("brush").classList.add("activo");
      document.getElementById("eraser").classList.remove("activo");
      console.log("Activando edición");
    }  else {
      edicion = false;
      document.getElementById("brush").classList.remove("activo");

    }
    if (edicion == true) {
      canvas.style.pointerEvents = 'auto'; // activar pintar
    } else {
      canvas.style.pointerEvents = 'none'; // desactivar pintar
    };
    

    tool = "brush";
    
    ctx.lineWidth = 10;
  });
  
  document.getElementById("eraser").addEventListener("click", () => {
    
    if(edicion == false){
      edicion = true;
      console.log("Activando edición");
      document.getElementById("eraser").classList.add("activo");
      document.getElementById("brush").classList.remove("activo");
      console.log("Activando edición");
    }  else {
      edicion = false;
      document.getElementById("eraser").classList.remove("activo");

    }
    if (edicion == true) {
     
      canvas.style.pointerEvents = 'auto'; // activar pintar
    } else {
      canvas.style.pointerEvents = 'none'; // desactivar pintar
    };
    tool = "eraser";
    
    ctx.lineWidth = 10;
  });
  
  canvas.addEventListener("mousedown", e => {
    isDrawing = true;
    ctx.beginPath();
    const x = e.clientX - canvas.getBoundingClientRect().left;
    const y = e.clientY - canvas.getBoundingClientRect().top;
    ctx.moveTo(x, y);
  });
  
  canvas.addEventListener("mousemove", e => {
    if(edicion==true){
      if (isDrawing === true && tool === "brush") {
        const x = e.clientX - canvas.getBoundingClientRect().left;
        const y = e.clientY - canvas.getBoundingClientRect().top;
        ctx.lineTo(x, y);
        ctx.stroke();
         /*currentState = canvas.toDataURL();
    canvasState.push(currentState);
    console.log(canvasState);*/
      } else if (isDrawing === true && tool === "eraser") {
        const x = e.clientX - canvas.getBoundingClientRect().left;
        const y = e.clientY - canvas.getBoundingClientRect().top;
        ctx.clearRect(x - ctx.lineWidth / 2, y - ctx.lineWidth / 2, ctx.lineWidth, ctx.lineWidth);
      }
    }
  
  });
  const currentState = canvas.toDataURL();
    canvasState.push(currentState);
  //canvas.addEventListener("mouseup", () => ());
  canvas.addEventListener("mouseup", () => {
    isDrawing = false
    //alert("mouseup");
    const currentState = canvas.toDataURL();
    canvasState.push(currentState);
  });
  
  const brushSize = document.getElementById("brush-size");
  const eraserSize = document.getElementById("eraser-size");
  
  brushSize.addEventListener("change", function() {
    ctx.lineWidth = parseFloat(this.value);
  });
  
  eraserSize.addEventListener("change", function() {
    ctx.lineWidth = parseFloat(this.value);
  });
  

  
  const brushColorInput = document.getElementById("brush-color");
  brushColorInput.addEventListener("change", function() {
    ctx.strokeStyle = this.value;
  });

  




  const addTextBtn = document.getElementById("add-text-btn");

// Función para manejar el evento click del botón


// Fuentes

const fontSelect = document.getElementById("font-select");
fontSelect.addEventListener("change", function() {
  const font = fontSelect.value;
  ctx.font = "16px " + font;
});


// Función para manejar el evento click del botón



//descargar imagen

const downloadButton = document.getElementById("download-button");



// Descargar imagen nuevo


const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

function drawAll() {
  ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
  ctx3.drawImage(canvas2, 0, 0, canvasWidth , canvasHeight, 0, 0, canvas3.width, canvas3.height);
  ctx3.drawImage(canvas, 0, 0, canvasWidth, canvasHeight, 0, 0, canvas3.width, canvas3.height);

}

function downloadImage() {
  console.log(clickedText);
  console.log(selectedImage);
  clickedText = null;
  if(selectedImage){
    selectedImage.isSelected = false;
  }
  
  selectedText = null;
 
  //selectedImage.isSelected = false;
  console.log(clickedText);
  console.log(selectedImage);
  drawImages();
  
  
    drawAll();
    const dataUrl = canvas3.toDataURL();
    const link = document.createElement("a");
    link.download = "canvas.png";
    link.href = dataUrl;
    link.click();
  
}

// Añade un event listener al botón de descarga
downloadButton.addEventListener("click", downloadImage);



/*var currentState = canvas.toDataURL();
canvasState.push(currentState);*/
function undo() {
  if (canvasState.length > 1) {
    canvasState.pop();
    var img = new Image();
    img.src = canvasState[canvasState.length - 1];
    img.onload = function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    };
  }
}





// textos ---------------------------


const texts = [];
let selectedText = null;
let isDraggingText = false;
let isResizingText = false;

function drawTexts() {
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  drawImages();
  texts.forEach(function(text) {
    ctx2.font = text.fontSize + "px " + text.font;
    var textWidth = ctx2.measureText(text.text).width;
    text.w = textWidth;
    text.h = text.fontSize * 1.2;
    ctx2.fillText(text.text, text.x, text.y + text.h);
    if (selectedText && text === selectedText) {
      ctx2.lineWidth = 3;
      ctx2.strokeStyle = "black";
      ctx2.strokeRect(text.x, text.y, text.w, text.h);
      ctx2.beginPath();
    }
  });
  
  // No borrar el texto seleccionado
  
}


// Función para manejar el evento click del botón
addTextBtn.addEventListener("click", function() {
  // Obtener el texto del usuario
  const text = prompt("Ingrese el texto a agregar:");
  if (text) {
    const x = canvas2.width / 2;
    const y = canvas2.height / 2;
    const maxWidth = 200;
    const lineHeight = 20;
    const fontSize = 16;
    const font = fontSelect.value;

    // Dividir el texto en líneas para que quepa en el cuadro de texto
    const words = text.split(" ");
    let line = "";
    let lines = [];
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      const metrics = ctx2.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && i > 0) {
        lines.push(line);
        line = words[i] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    // Agregar cada línea de texto como un objeto al arreglo de textos
    const canvasRect = canvas2.getBoundingClientRect();
    lines.forEach(function(line, index) {
      const textWidth = ctx2.measureText(line).width;
      const textHeight = fontSize * 1.2;
      texts.push({
        text: line,
        x: x - (textWidth / 2),
        y: y + (index * lineHeight) - ((lines.length - 1) * lineHeight / 2),
        w: textWidth,
        h: textHeight,
        fontSize: fontSize,
        font: font,
        isDragging: false
      });
    });
    // Dibujar los textos

drawImages();
}
});

// Función para manejar el evento mousedown en el canvas
canvas2.addEventListener('mousedown', function(e) {
  const canvasRect = canvas2.getBoundingClientRect();
  const mouseX = e.clientX - canvasRect.left;
  const mouseY = e.clientY - canvasRect.top;
   clickedText = null;

  // Verificar si se ha hecho clic en un texto existente
  for (let i = texts.length - 1; i >= 0; i--) {
    const text = texts[i];
    if (mouseX >= text.x && mouseX <= text.x + text.w && mouseY >= text.y && mouseY <= text.y + text.h) {
      clickedText = text;
      break;
    }
  }

  if (clickedText) {
    // Si se ha hecho clic en un texto existente
    selectedText = clickedText;
    const offsetX = mouseX - clickedText.x;
    const offsetY = mouseY - clickedText.y;
    if (mouseX >= clickedText.x + clickedText.w - 10 && mouseY >= clickedText.y + clickedText.h - 10) {
      // Si se ha hecho clic en la esquina inferior derecha, redimensionar el texto
      
      isResizingText = true;
      clickedText.offsetX = offsetX;
      clickedText.offsetY = offsetY;
      clickedText.originalWidth = clickedText.w;
      clickedText.originalHeight = clickedText.h;
    } else {
      // Si se ha hecho clic dentro del cuadro del texto, arrastrar el texto
      isDraggingText = true;
      clickedText.isDragging = true;
      clickedText.offsetX = offsetX;
      clickedText.offsetY = offsetY;
    }
    drawImages();
  } else {
    // Si se ha hecho clic fuera de cualquier texto, deseleccionar el texto actual
    selectedText = null;
    isDraggingText = false;
    isResizingText = false;
    drawImages();
  }
});


// Función para manejar el evento mousemove en el canvas
canvas2.addEventListener("mousemove", function(e) {
  if (isDraggingText) {
    const canvasRect = canvas2.getBoundingClientRect();
    const mouseX = e.clientX - canvasRect.left;
    const mouseY = e.clientY - canvasRect.top;
    // Mover el texto seleccionado a la posición del mouse
    selectedText.x = mouseX - selectedText.w / 2;
    selectedText.y = mouseY - selectedText.h / 2;
    // Volver a dibujar los textos
    drawImages();
  } else if (isResizingText) {
      const canvasRect = canvas2.getBoundingClientRect();
      const mouseX = e.clientX - canvasRect.left;
      const mouseY = e.clientY - canvasRect.top;
      // Calcular el cambio de tamaño en la dirección X e Y
      const deltaWidth = mouseX - selectedText.x - selectedText.w / 2;
      const deltaHeight = mouseY - selectedText.y - selectedText.h / 2;
      // Calcular el nuevo tamaño de fuente y altura proporcionalmente
      const newFontSize = selectedText.fontSize + deltaWidth / 10;
      const newHeight = newFontSize * 1.2;
      // Actualizar la fuente y la altura del texto seleccionado
      selectedText.fontSize = newFontSize;
      selectedText.h = newHeight;
      // Volver a dibujar los textos
      drawImages();
  }
});

// Función para manejar el evento mouseup en el canvas
canvas2.addEventListener("mouseup", function(e) {
isDraggingText = false;

  isResizingText = false;
drawImages();

});


