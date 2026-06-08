import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function generarReporteProductos(productos, titulo = "Reporte de Productos"){
    //crear pdf

    const doc = new jsPDF();

    // configurar fecha actual

    const fechaActual = new Date();
    const fechaFormeatada = fechaActual.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    const horaFormateada =  fechaActual.toLocaleTimeString('es-ES')

    //titulo princiapl

    doc.setFontSize(20);
    doc.setTextColor(139, 69, 19);
    doc.text(" Panaderia Masitas", 105, 20, { align: "center" });

    doc.setDrawColor(212, 163, 115);
    doc.line(20, 28, 190, 28);

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(titulo, 105, 40, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generado: ${fechaFormeatada} - ${horaFormateada}`, 105, 25, { align: "center" });


    // tabla de prodcutos

    const tableData  = productos.map((producto, index)=>[
        index + 1,
        producto.nombre,
        `Bs${parseFloat(producto.precio).toFixed(2)}`,
        producto.stock,
        producto.categoria_nombre || producto.categoria_id || "N/A"
    ])

    //confirugrar y dibujar tabla

    autoTable(doc, {
        startY: 60,
        head: [["#", "Producto", "Precio", "Stock", "Categoria"]],
        body: tableData,
        theme: 'striped',
        headStyles: {
            fillColor: [139, 69, 19],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245]
        },

        margin: { top: 60, left: 14, right: 14},
        columnStyles: {
            0: { cellWidth: 15, halign: 'center'},
            1: { cellWidth: 70},
            2: { cellWidth: 30, halign: 'right'},
            3: { cellWidth: 25, halign: 'center'},
            4: { cellWidth: 40}
        }
    })

    // pie de pagina

    const finalY = doc.lastAutoTable.finalY || 80;

    // resumen 
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`total de productos: ${productos.length}`, 105, finalY + 10, { align: "center"});

    doc.save(`reporte_productos_${fechaActual.toISOString().split[0]}.pdf`)

}