import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { validateHTML, stripHTMLTags } from '@/lib/utils';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
import {
  TITLE_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  DESC_MIN_LENGTH,
  DESC_MAX_LENGTH,
  CONTENT_MIN_LENGTH,
  CONTENT_MAX_LENGTH,
} from '@/lib/constants';

const isValidImg = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

const validateImgsInContent = async (html: string): Promise<boolean> => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const imgTags = doc.querySelectorAll('img');
  if (imgTags.length === 0) return false;
  for (const img of imgTags) {
    const src = img.getAttribute('src');
    if (src) {
      const isValid = await isValidImg(src);
      if (!isValid) {
        return false;
      }
    }
  }
  return true;
};

const formSchema = z.object({
  title: z
    .string()
    .min(
      TITLE_MIN_LENGTH,
      `Title must be at least ${TITLE_MIN_LENGTH} characters.`,
    )
    .max(
      TITLE_MAX_LENGTH,
      `Title cannot exceed ${TITLE_MAX_LENGTH} characters.`,
    ),
  description: z
    .string()
    .min(
      DESC_MIN_LENGTH,
      `Description must be at least ${DESC_MIN_LENGTH} characters.`,
    )
    .max(
      DESC_MAX_LENGTH,
      `Description cannot exceed ${DESC_MAX_LENGTH} characters.`,
    ),
  category: z
    .string()
    .min(2, 'Category must be at least 2 characters.')
    .max(20, 'Category cannot exceed 20 characters.')
    .refine((val) => /^[a-zA-Z\u0600-\u06FF\s]+$/.test(val), {
      message: 'Category can only contain letters and spaces.',
    }),
  tags: z
    .string()
    .array()
    .min(1, 'You must provide at least one tag.')
    .max(5, 'You can provide up to 5 tags.')
    .refine(
      (tags) => tags.every((tag) => tag.length >= 2 && tag.length <= 20),
      {
        message: 'Each tag should be between 2 to 20 characters.',
      },
    )
    .refine(
      (tags) => tags.every((tag) => /^[a-zA-Z\u0600-\u06FF\s0-9]+$/.test(tag)),
      {
        message: 'Each tag can only contain letters and spaces.',
      },
    ),
  thumbnail: z
    .instanceof(File)
    .refine((file) => file.type.startsWith('image/'), {
      message: 'Thumbnail must be an image file (e.g., .jpg, .png).',
    })
    .optional(),
  content: z
    .string()
    .refine((html) => validateHTML(html), {
      message: 'Content must be valid HTML.',
    })
    .refine(
      (html) => {
        const textContent = stripHTMLTags(html);
        const wordCount = textContent.trim().split(/\s+/).length;
        return (
          wordCount >= CONTENT_MIN_LENGTH && wordCount <= CONTENT_MAX_LENGTH
        );
      },
      {
        message: `Content must have between ${CONTENT_MIN_LENGTH} and ${CONTENT_MAX_LENGTH} words (excluding HTML tags).`,
      },
    )
    .refine(
      async (html) => {
        const hasValidImage = await validateImgsInContent(html);
        return hasValidImage;
      },
      {
        message: 'Content must contain at least one valid Base64 image.',
      },
    ),
});

export const useArticleForm = (edit: boolean) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      tags: [],
      thumbnail: undefined,
      content: '',
    },
  });

  useUnsavedChanges(form, edit);
  return { form, formSchema };
};
