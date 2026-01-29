import React, { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '../../services/supabase'
import toast from 'react-hot-toast'

const videoSchema = z.object({
  campaignId: z.string().min(1, 'Please select a campaign'),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  platform: z.enum(['youtube', 'instagram', 'tiktok', 'facebook'])
})

const VideoUpload = ({ campaigns, onSuccess }) => {
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState(null)
  const fileInputRef = useRef(null)

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(videoSchema)
  })

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast.error('Please select a video file')
      return
    }

    // Validate file size (max 500MB)
    if (file.size > 500 * 1024 * 1024) {
      toast.error('File size must be less than 500MB')
      return
    }

    setSelectedFile(file)
    
    // Create preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const uploadVideoToStorage = async (file, userId) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`
    const filePath = `videos/${fileName}`

    const { error } = await supabase.storage
      .from('kreaterly-videos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('kreaterly-videos')
      .getPublicUrl(filePath)

    return publicUrl
  }

  const onSubmit = async (data) => {
    if (!selectedFile) {
      toast.error('Please select a video file')
      return
    }

    setUploading(true)
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Upload video to Supabase Storage
      toast.loading('Uploading video...')
      const videoUrl = await uploadVideoToStorage(selectedFile, user.id)

      // Create submission record
      const submissionData = {
        campaign_id: data.campaignId,
        user_id: user.id,
        title: data.title,
        description: data.description,
        video_url: videoUrl,
        platform: data.platform,
        file_name: selectedFile.name,
        file_size: selectedFile.size,
        file_type: selectedFile.type
      }

      const { error: submissionError } = await supabase
        .from('submissions')
        .insert([submissionData])

      if (submissionError) throw submissionError

      toast.dismiss()
      toast.success('Video submitted successfully!')

      // Reset form
      reset()
      removeFile()
      
      // Notify parent
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('Submission error:', error)
      toast.error(error.message || 'Failed to submit video')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Submit Video Content</h2>
        <p className="text-gray-600">Upload your video for campaign consideration</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Campaign Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Campaign
          </label>
          <select
            {...register('campaignId')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Choose a campaign</option>
            {campaigns.map(campaign => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.name} - {campaign.brand} (UGX {campaign.budget_per_creator})
              </option>
            ))}
          </select>
          {errors.campaignId && (
            <p className="mt-1 text-sm text-red-600">{errors.campaignId.message}</p>
          )}
        </div>

        {/* Video Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video Title
            </label>
            <input
              type="text"
              {...register('title')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter video title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform
            </label>
            <select
              {...register('platform')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="youtube">YouTube</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="facebook">Facebook</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Describe your video content and how it aligns with the campaign"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* File Upload */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Video
          </label>
          
          {!selectedFile ? (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-purple-500 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-600 mb-2">
                Drag & drop your video here
              </p>
              <p className="text-gray-500 mb-4">or click to browse</p>
              <button
                type="button"
                className="px-6 py-2 border-2 border-purple-500 text-purple-500 rounded-lg hover:bg-purple-50 transition-colors"
              >
                Browse Files
              </button>
              <p className="text-sm text-gray-500 mt-4">
                Supported: MP4, MOV, AVI, WMV • Max 500MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-800">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {previewUrl && (
                <div className="mb-6">
                  <video
                    src={previewUrl}
                    controls
                    className="w-full rounded-lg"
                  />
                </div>
              )}

              {uploadProgress > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Uploading...</span>
                    <span className="font-medium">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center text-sm text-gray-600">
                <AlertCircle className="w-4 h-4 mr-2" />
                <span>Video ready for submission</span>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={removeFile}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading || !selectedFile}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              'Submit Video'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default VideoUpload