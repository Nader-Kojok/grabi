import React, { useState } from 'react';
import { Plus, X, ExternalLink } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';

interface SocialLinksManagerProps {
  socialLinks: Record<string, string>;
  onUpdate: (socialLinks: Record<string, string>) => void;
  isEditing: boolean;
}

const POPULAR_PLATFORMS = [
  { name: 'Twitter', placeholder: 'https://twitter.com/username' },
  { name: 'Instagram', placeholder: 'https://instagram.com/username' },
  { name: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
  { name: 'Facebook', placeholder: 'https://facebook.com/username' },
  { name: 'YouTube', placeholder: 'https://youtube.com/@username' },
  { name: 'TikTok', placeholder: 'https://tiktok.com/@username' },
  { name: 'GitHub', placeholder: 'https://github.com/username' },
  { name: 'Website', placeholder: 'https://votre-site.com' },
];

export const SocialLinksManager: React.FC<SocialLinksManagerProps> = ({
  socialLinks,
  onUpdate,
  isEditing
}) => {
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const handleAddLink = () => {
    if (newPlatform.trim() && newUrl.trim()) {
      const updatedLinks = {
        ...socialLinks,
        [newPlatform.trim()]: newUrl.trim()
      };
      onUpdate(updatedLinks);
      setNewPlatform('');
      setNewUrl('');
    }
  };

  const handleRemoveLink = (platform: string) => {
    const updatedLinks = { ...socialLinks };
    delete updatedLinks[platform];
    onUpdate(updatedLinks);
  };

  const handleUpdateLink = (platform: string, url: string) => {
    const updatedLinks = {
      ...socialLinks,
      [platform]: url
    };
    onUpdate(updatedLinks);
  };

  const addPredefinedPlatform = (platform: string) => {
    if (!socialLinks[platform]) {
      setNewPlatform(platform);
      setNewUrl('');
    }
  };

  if (!isEditing) {
    // Display mode
    const linkEntries = Object.entries(socialLinks || {}).filter(([_, url]) => url.trim());
    
    if (linkEntries.length === 0) {
      return (
        <div className="text-gray-500 text-center py-4">
          Aucun lien social ajouté
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {linkEntries.map(([platform, url]) => (
          <div key={platform} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex-1">
              <div className="font-medium text-gray-900">{platform}</div>
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
              >
                {url}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Edit mode
  return (
    <div className="space-y-4">
      {/* Existing links */}
      {Object.entries(socialLinks || {}).map(([platform, url]) => (
        <div key={platform} className="flex items-center gap-3">
          <div className="flex-1 grid grid-cols-2 gap-3">
            <Input
              value={platform}
              onChange={(e) => {
                const newPlatform = e.target.value;
                const updatedLinks = { ...socialLinks };
                delete updatedLinks[platform];
                updatedLinks[newPlatform] = url;
                onUpdate(updatedLinks);
              }}
              placeholder="Plateforme"
              className="border-gray-300 focus:border-red-500 focus:ring-red-500"
            />
            <Input
              value={url}
              onChange={(e) => handleUpdateLink(platform, e.target.value)}
              placeholder="URL"
              className="border-gray-300 focus:border-red-500 focus:ring-red-500"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRemoveLink(platform)}
            className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}

      {/* Add new link */}
      <div className="border-t pt-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 grid grid-cols-2 gap-3">
            <Input
              value={newPlatform}
              onChange={(e) => setNewPlatform(e.target.value)}
              placeholder="Nom de la plateforme"
              className="border-gray-300 focus:border-red-500 focus:ring-red-500"
            />
            <Input
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="URL complète"
              className="border-gray-300 focus:border-red-500 focus:ring-red-500"
            />
          </div>
          <Button
            onClick={handleAddLink}
            disabled={!newPlatform.trim() || !newUrl.trim()}
            className="bg-red-600 hover:bg-red-700"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick add buttons for popular platforms */}
        <div className="flex flex-wrap gap-2">
          {POPULAR_PLATFORMS.filter(p => !socialLinks[p.name]).map((platform) => (
            <Button
              key={platform.name}
              variant="outline"
              size="sm"
              onClick={() => addPredefinedPlatform(platform.name)}
              className="text-xs border-gray-200 hover:border-red-300 hover:text-red-600"
            >
              + {platform.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};