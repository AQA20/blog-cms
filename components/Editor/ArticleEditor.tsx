'use client';

import React, { useState, useEffect } from 'react';
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
  setFormData,
  setSuccess,
  setIsLoading,
} from '@/app/store/slices/ArticleFormDataSlice';
import { RawArticle } from '@/types/Article';
import { createArticle, updateArticle } from '@/services/articlesService';
import { useMutation } from '@tanstack/react-query';
import { useAppToast } from '@/hooks/useAppToast';
import { useFormSubmit } from '@/providers/FormSubmitProvider';
import { useRouter } from 'next/navigation';
import { EditArticleFormData } from '@/types/ArticleFormData';

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

  const handleEditContext = (article: EditArticleFormData) => {
    setFormData(article);
    Object.entries(article).forEach(([key, value]) => {
      if (key === 'tags') {
        setTags(value);
        form.setValue('tags', value);
      } else if (validKeys.includes(key as keyof FormFields)) {
        form.setValue(key as keyof FormFields, value);
      }
    });
  };

  useEffect(() => {
    if (article) {
      handleEditContext(article);
    }
  }, [article]);

  useEffect(() => {
    setSubmitFn(() => form.handleSubmit(onSubmit));
  }, []);

  const { mutate: submitForm } = useMutation<
    RawArticle,
    Error,
    z.infer<typeof formSchema>
  >({
    mutationFn: async (
      values: z.infer<typeof formSchema>,
    ): Promise<RawArticle> => {
      dispatch(setIsLoading(true));

      let articleData: RawArticle;
      if (article) {
        articleData = await updateArticle(
          values,
          article.id,
          article.thumbnailId,
        );
      } else {
        articleData = await createArticle(values);
      }
      return articleData;
    },
    onSuccess: () => {
      dispatch(setSuccess(true));
      showToast({ description: 'Article was successfully created!' });
      form.reset();
      router.push('/dashboard');
    },
    onError: (error) => {
      dispatch(setError(error.message));
      dispatch(setSuccess(false));
      showToast({ description: error.message, success: false });
    },
    onSettled: () => dispatch(setIsLoading(false)),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    form.setValue('tags', tags);
    dispatch(setFormData(values));
    submitForm(values);
  }

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const tag = inputValue.trim();
    if (e.code === 'Enter' && tag && tags.length < 5) {
      e.preventDefault();
      // If tag is not exist
      if (!tags.includes(tag)) {
        setTags((prevTags) => {
          // append new tag to prevTags
          const newTags = [...prevTags, tag];
          // Update form tags value
          form.setValue('tags', newTags);
          // return the newTags
          return newTags;
        });
      }
      setInputValue(''); // Clear input field after adding tag
    }
  };

  const handleRemoveTag = (name: string) => {
    setTags((prevTags) => {
      // Remove the target tag
      const updatedTags = prevTags.filter((tag) => tag !== name);
      // Update form tags value
      form.setValue('tags', updatedTags);
      // return the updatedTags
      return updatedTags;
    });
  };

  return (
    <Form {...form}>
      <form method="POST" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="md:max-wd-screen-md w-full max-w-screen-lg space-y-4 px-2">
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                    className="h-[140px] resize-none md:h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="block w-full space-x-2 md:flex">
            <FormField
              control={form.control}
              name="tags"
              render={() => (
                <FormItem className="flex-1">
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    {/* Badge container and input */}
                    <div
                      className="flex flex-row-reverse flex-wrap items-center gap-2 rounded-md"
                      dir="rtl"
                    >
                      <Input
                        type="text"
                        value={inputValue}
                        disabled={tags.length === 5}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKey}
                        placeholder="اكتب هاشتاغ واضغط انتر"
                        dir="rtl"
                        className="text-right"
                      />
                      {/* Render badges */}
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
                              onClick={() => handleRemoveTag(tag)}
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

          <FormField
            control={form.control}
            name="thumbnail"
            render={(field) => (
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
                    className="w-fit"
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || undefined;
                      form.setValue('thumbnail', file); // Update form value
                      form.trigger('thumbnail'); // Trigger validation manually (optional)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Article body</FormLabel>
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
