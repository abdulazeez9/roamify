import React, { useState } from 'react';
import { Button, Input, VStack } from '@chakra-ui/react';
import { useBulkUploadGallery } from '@/hooks';

export function GalleryUpload({ adventureId }: { adventureId: string }) {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const { mutate: uploadGallery, isPending } = useBulkUploadGallery();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = () => {
    if (!selectedFiles) return;

    // Convert FileList to File array
    const filesArray = Array.from(selectedFiles);

    uploadGallery({
      adventureId: adventureId,
      files: filesArray,
      altTexts: filesArray.map((f) => f.name),
    });
  };

  return (
    <VStack align='start' gap={4}>
      <Input
        type='file'
        multiple
        accept='image/*'
        onChange={handleFileChange}
      />
      <Button
        loading={isPending}
        onClick={handleUpload}
        disabled={!selectedFiles}
      >
        Upload to Gallery
      </Button>
    </VStack>
  );
}
