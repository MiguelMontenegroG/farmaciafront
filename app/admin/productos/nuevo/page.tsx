"use client"

import { useState, useEffect } from "react"
import { adminApi, ProductoForm, Category } from "@/lib/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function AddProductPage() {
  const router = useRouter()
  const [product, setProduct] = useState<ProductoForm>({
    nombre: "",
    descripcion: "",
    precio: 0,
    precioOferta: 0,
    enOferta: false,
    categoria: { id: "" },
    imagenUrl: "",
    stock: 0,
    activo: true,
    laboratorio: "",
    principioActivo: "",
    codigoBarras: "",
    requiereReceta: false,
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    adminApi.getCategories().then(setCategories)
  }, [])

const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  if (!event.target.files || event.target.files.length === 0) return;

  const formData = new FormData();
  formData.append("imagen", event.target.files[0]);

  try {
    setUploading(true);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/imagenes/subir`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log(" Respuesta backend:", data);

    if (!data.error) {
      const imageUrl = data.respuesta; // 👈 aquí está tu URL
      console.log(" Imagen subida:", imageUrl);

      // 🔹 Guardar en el estado del producto
      setProduct((prev) => ({ ...prev, imagenUrl: imageUrl }));
    } else {
      console.error(" Error del backend:", data);
    }
  } catch (error) {
    console.error(" Error en fetch:", error);
  } finally {
    setUploading(false);
  }
};


  // 🔹 Guardar producto
  const handleSave = async () => {
    if (!product.nombre || !product.descripcion || !product.categoria.id) {
      alert("Nombre, descripción y categoría son obligatorios")
      return
    }

    setSaving(true)
    try {
      await adminApi.createProduct(product)
      router.push("/admin/productos")
    } catch (err) {
      console.error(err)
      alert("No se pudo crear el producto. Revisa la consola.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Agregar Producto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* Nombre */}
          <label>Nombre</label>
          <Input
            placeholder="Nombre"
            value={product.nombre}
            onChange={(e) => setProduct({ ...product, nombre: e.target.value })}
          />

          {/* Descripción */}
          <label>Descripción</label>
          <textarea
            placeholder="Descripción"
            value={product.descripcion}
            onChange={(e) => setProduct({ ...product, descripcion: e.target.value })}
            className="w-full p-2 border rounded"
          />

          {/* Categoría */}
          <label>Categoría</label>
          <select
            value={product.categoria.id}
            onChange={(e) => setProduct({ ...product, categoria: { id: e.target.value } })}
            className="w-full p-2 border rounded"
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>  
           ))}
          </select>

          {/* Precio */}
          <label>Precio</label>
          <Input
            type="number"
            placeholder="Precio"
            value={product.precio}
            onChange={(e) => setProduct({ ...product, precio: Number(e.target.value) })}
          />

          {/* Precio Oferta */}
          <label>Precio Oferta</label>
          <Input
            type="number"
            placeholder="Precio Oferta"
            value={product.precioOferta}
            onChange={(e) => setProduct({ ...product, precioOferta: Number(e.target.value) })}
          />

          {/* Stock */}
          <label>Stock</label>
          <Input
            type="number"
            placeholder="Stock"
            value={product.stock}
            onChange={(e) => setProduct({ ...product, stock: Number(e.target.value) })}
          />

          {/* Imagen */}
          <label>Imagen del producto</label>
          <Input type="file" accept="image/*" onChange={handleImageUpload} />
          {uploading && <p className="text-sm text-gray-500">Subiendo imagen...</p>}
          {product.imagenUrl && (
            <img src={product.imagenUrl} alt="preview" className="h-32 mt-2 rounded object-cover" />
          )}

          {/* Otros campos */}
          <label>Laboratorio</label>
          <Input
            placeholder="Laboratorio"
            value={product.laboratorio}
            onChange={(e) => setProduct({ ...product, laboratorio: e.target.value })}
          />

          <label>Principio Activo</label>
          <Input
            placeholder="Principio Activo"
            value={product.principioActivo}
            onChange={(e) => setProduct({ ...product, principioActivo: e.target.value })}
          />

          <label>Código de Barras</label>
          <Input
            placeholder="Código de Barras"
            value={product.codigoBarras}
            onChange={(e) => setProduct({ ...product, codigoBarras: e.target.value })}
          />

          {/* Checks */}
          <div className="flex flex-col gap-2">
            <label>
              <input
                type="checkbox"
                checked={product.enOferta}
                onChange={(e) => setProduct({ ...product, enOferta: e.target.checked })}
              /> En Oferta
            </label>
            <label>
              <input
                type="checkbox"
                checked={product.activo}
                onChange={(e) => setProduct({ ...product, activo: e.target.checked })}
              /> Activo
            </label>
            <label>
              <input
                type="checkbox"
                checked={product.requiereReceta}
                onChange={(e) => setProduct({ ...product, requiereReceta: e.target.checked })}
              /> Requiere Receta
            </label>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => router.push("/admin/productos")}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving || uploading}>
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
