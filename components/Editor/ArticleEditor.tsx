'use client';

import React, { useState, useEffect, useCallback } from 'react';
import TiptapEditor from '@/components/Editor/TipTap/TiptapEditor';
import { z } from 'zod';
import { X } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useArticleForm } from '@/hooks/useArticleForm';
import { BadgeComponent } from '@/components/BadgeComponent/BadgeComponent';
import { useAppStore } from '@/hooks/useAppStore';
import {
  setError,
  setSuccess,
  setIsLoading,
} from '@/app/store/slices/ArticleFormDataSlice';
import { RawArticle } from '@/types/Article';
import { createArticle, updateArticle } from '@/services/articlesService';
import { useMutation } from '@tanstack/react-query';
import { useAppToast } from '@/hooks/useAppToast';
import { useFormSubmit } from '@/providers/FormSubmitProvider';
import { useRouter } from 'next/navigation';
import { ArticleFormData, EditArticleFormData } from '@/types/ArticleFormData';
import useLocalStorage from '@/hooks/useLocalStorage';
import { MAX_TAGS } from '@/lib/constants';

interface Props {
  article?: EditArticleFormData;
}

const ArticleEditor: React.FC<Props> = ({ article }) => {
  const { form, formSchema } = useArticleForm(!!article);
  type FormFields = z.infer<typeof formSchema>;
  const validKeys = Object.keys(formSchema.shape) as Array<keyof FormFields>;

  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const { dispatch } = useAppStore();
  const { setSubmitFn } = useFormSubmit();
  const { showToast } = useAppToast();
  const router = useRouter();

  const [formData, , removeLocalStorageValue] = useLocalStorage<FormFields>(
    'formData',
    form.getValues(),
  );

  /** Set form values from article or localStorage data */
  const setFormValues = useCallback(
    (data: EditArticleFormData | ArticleFormData) => {
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'tags') {
          setTags(value as string[]);
          form.setValue('tags', value);
        } else if (validKeys.includes(key as keyof FormFields)) {
          form.setValue(key as keyof FormFields, value);
        }
      });
    },
    [],
  );

  /** Handle form initialization for editing or draft recovery */
  useEffect(() => {
    if (article) {
      setFormValues(article);
    } else if (formData) {
      setFormValues(formData);
    }
  }, [article, formData, setFormValues]);

  /** Set form submission function */
  useEffect(() => {
    setSubmitFn(() => form.handleSubmit(onSubmit));
  }, [form]);

  /** Synchronize tags with the form */
  useEffect(() => {
    form.setValue('tags', tags);
  }, [tags]);

  /** Form mutation logic */
  const { mutate: submitForm } = useMutation<
    RawArticle,
    Error,
    z.infer<typeof formSchema>
  >({
    mutationFn: async (values) => {
      dispatch(setIsLoading(true));

      const articleData = article
        ? await updateArticle(values, {
            articleId: article.id,
            thumbnailId: article.thumbnailId,
            thumbnail: values.thumbnail,
          })
        : await createArticle(values, values.thumbnail);

      return articleData;
    },
    onSuccess: () => {
      dispatch(setSuccess(true));
      showToast({
        description: `Article successfully ${article ? 'updated' : 'created'}!`,
      });
      form.reset();
      if (!article) removeLocalStorageValue();
      router.push('/dashboard');
    },
    onError: (error) => {
      dispatch(setError(error.message));
      dispatch(setSuccess(false));
      showToast({ description: error.message, success: false });
    },
    onSettled: () => dispatch(setIsLoading(false)),
  });

  /** Form submission handler */
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    submitForm(values);
  };

  /** Add new tag */
  const addTag = useCallback(() => {
    const trimmedTag = inputValue.trim();
    if (trimmedTag && tags.length < MAX_TAGS && !tags.includes(trimmedTag)) {
      setTags((prevTags) => [...prevTags, trimmedTag]);
      setInputValue('');
    }
  }, [inputValue, tags]);

  /** Remove an existing tag */
  const removeTag = useCallback((tag: string) => {
    setTags((prevTags) => prevTags.filter((t) => t !== tag));
  }, []);

  /** Handle keyboard input for tags */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.code === 'Period') {
        e.preventDefault();
        addTag();
      }
    },
    [addTag],
  );

  /** Render the form */
  return (
    <Form {...form}>
      <form method="POST" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="md:max-wd-screen-md w-full max-w-screen-lg space-y-4 px-2">
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="عنوان المقال"
                    type="text"
                    {...field}
                    dir="rtl"
                    maxLength={100}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    dir="rtl"
                    placeholder="وصف المقال"
                    className="h-[220px] resize-none overflow-hidden md:h-[80px]"
                    maxLength={300}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Tags and Category */}
          <div className="block w-full space-x-2 md:flex">
            <FormField
              control={form.control}
              name="tags"
              render={() => (
                <FormItem className="flex-1">
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <div
                      className="flex flex-row-reverse flex-wrap items-center gap-2 rounded-md"
                      dir="rtl"
                    >
                      <Input
                        type="text"
                        disabled={tags.length >= MAX_TAGS}
                        placeholder="اكتب هاشتاغ واضغط نقطة"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                      <div className="flex w-full flex-wrap gap-2">
                        {tags.map((tag) => (
                          <BadgeComponent
                            key={tag}
                            name={tag}
                            className="rounded-md px-2 py-1"
                          >
                            <X
                              className="cursor-pointer"
                              size={14}
                              onClick={() => removeTag(tag)}
                            />
                          </BadgeComponent>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input
                      dir="rtl"
                      placeholder="موضوع المقال"
                      autoComplete="none"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Thumbnail Field */}
          <FormField
            control={form.control}
            name="thumbnail"
            render={() => (
              <FormItem>
                <FormLabel>
                  Choose article thumbnail{' '}
                  <span className="text-zinc-500">
                    (or leave empty to use first image in article as the
                    thumbnail image)
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    className="w-fit"
                    accept="image/*"
                    onChange={(e) =>
                      form.setValue(
                        'thumbnail',
                        e.target.files?.[0] || undefined,
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Content Editor */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <TiptapEditor
                    className="mt-4"
                    content={field.value}
                    onChange={(value) => form.setValue('content', value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};

export default ArticleEditor;
