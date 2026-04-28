import { Modal, Slider, Space, Typography } from 'antd'
import { useEffect, useState } from 'react'
import Cropper, { type Area } from 'react-easy-crop'
import { cropImageToFile } from '../util/cropImage'

type AdminImageCropModalProps = {
  open: boolean
  file: File | null
  title?: string
  aspect?: number
  onCancel: () => void
  onConfirm: (file: File) => Promise<void> | void
}

export function AdminImageCropModal({
  open,
  file,
  title = 'Recortar imagem',
  aspect = 800 / 445,
  onCancel,
  onConfirm,
}: AdminImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [saving, setSaving] = useState(false)
  const [imageSrc, setImageSrc] = useState('')

  useEffect(() => {
    if (!file) {
      setImageSrc('')
      return
    }
    const url = URL.createObjectURL(file)
    setImageSrc(url)
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [file])

  const confirm = async () => {
    if (!file || !croppedAreaPixels) return
    setSaving(true)
    try {
      const cropped = await cropImageToFile(file, croppedAreaPixels, { width: 800, height: 445, quality: 0.9 })
      await onConfirm(cropped)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      title={title}
      onCancel={onCancel}
      onOk={() => void confirm()}
      okText="Recortar e enviar"
      cancelText="Cancelar"
      confirmLoading={saving}
      width={860}
      destroyOnHidden
    >
      <Typography.Paragraph type="secondary" style={{ marginBottom: 10 }}>
        Proporção fixa otimizada (800x445), ideal para capa com bom visual e carregamento rápido.
      </Typography.Paragraph>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 420,
          borderRadius: 12,
          overflow: 'hidden',
          background: '#111',
        }}
      >
        {imageSrc ? (
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            objectFit="horizontal-cover"
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, areaPixels) => setCroppedAreaPixels(areaPixels)}
          />
        ) : null}
      </div>
      <Space orientation="vertical" style={{ marginTop: 14, width: '100%' }} size={4}>
        <Typography.Text strong>Zoom</Typography.Text>
        <Slider min={1} max={3} step={0.01} value={zoom} onChange={setZoom} />
      </Space>
    </Modal>
  )
}
