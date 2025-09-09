'use client';
import React, { useState } from 'react';
import { ArticleInput, Section } from '@/lib/types/articleTypes';
import ImageUploader from './ImageUploader';
import { Button } from '../ui/button';
import { Category } from '@/lib/types/categoryTypes';
import AddSection from './AddSection';
import AddCategoryForm from './AddCategoryForm';
import { MdClose } from 'react-icons/md';
import Modal from '../Modal';

type ArticleFormProps = {
  categories: Category[];
  initialData?: {
    title: string;
    image: string;
    category?: Category;
    sections: Section[];
  };
  showCategorySelect: boolean;
  mode?: 'create' | 'edit';
  onSubmit: (data: ArticleInput) => void | Promise<void>;
};

const ArticleForm: React.FC<ArticleFormProps> = ({
  categories,
  initialData,
  showCategorySelect,
  onSubmit,
  mode = 'create',
}) => {
  const [addCategory, setAddCategory] = useState(false);
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [image, setImage] = useState(initialData?.image ?? '');
  const [category, setCategory] = useState<Category | null>(
    initialData?.category ?? null
  );
  const [sections, setSections] = useState<Section[]>(
    initialData?.sections ?? []
  );
  const [errors, setErrors] = useState<string[]>([]);

  const validate = () => {
    const errs: string[] = [];
    if (!title.trim()) errs.push('יש להזין כותרת');
    if (showCategorySelect && !category?._id) errs.push('יש לבחור קטגוריה');
    if (!image.trim()) errs.push('יש להעלות תמונה');
    if (sections.length === 0) errs.push('יש להוסיף לפחות קטע אחד');
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errs = validate();
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }

    const payload: ArticleInput = {
      title: title.trim(),
      image: image.trim(),
      categoryId: category!._id, // ⚠️ השתנה מ-category ל-categoryId
      sections: sections
        .filter(sec => sec.content.trim() !== '')
        .map(({ title = '', content, icon = '' }) => ({
          title: title.trim(),
          content: content.trim(),
          icon: icon.trim(),
        })),
    };

    console.log('📦 Sending payload:', payload);
    onSubmit(payload);
     setTitle('');
  setImage('');
  setCategory(null);
  setSections([]);
  setErrors([]);
  };

  const updateSection = (index: number, field: keyof Section, value: string) => {
    setSections(prev =>
      prev.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      )
    );
  };

  const removeSection = (index: number) => {
    setSections(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddCategory = (newCat: Category) => {
    setCategory(newCat);
    setAddCategory(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 space-y-6 bg-white rounded-xl shadow-md"
      noValidate
      aria-describedby={errors.length > 0 ? 'form-errors' : undefined}
    >
      <h2 className="text-2xl font-bold">
        {mode === 'edit' ? 'עריכת מאמר' : 'הוספת מאמר'}
      </h2>

      {errors.length > 0 && (
        <div
          id="form-errors"
          role="alert"
          className="p-4 border border-red-400 bg-red-50 text-red-700 rounded-md space-y-1"
        >
          {errors.map((err, idx) => (
            <p key={idx}>{err}</p>
          ))}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block mb-1 font-medium">
          כותרת
        </label>
        <input
          id="title"
          type="text"
          placeholder="כותרת"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded-md"
          required
          aria-invalid={errors.includes('יש להזין כותרת')}
        />
      </div>

      {showCategorySelect && (
        <div className="space-y-2">
          <label htmlFor="category" className="block mb-1 font-medium">
            קטגוריה
          </label>
          <select
            id="category"
            value={category?._id ?? ''}
            onChange={(e) => {
              const selected = categories.find((cat) => cat._id === e.target.value);
              setCategory(selected ?? null);
            }}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-myColor_red focus:border-myColor_red hover:border-myColor_red"
            required
            aria-invalid={errors.includes('יש לבחור קטגוריה')}
          >
            <option value="">בחר קטגוריה</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.category}
              </option>
            ))}
          </select>
          <Button
            type="button"
            variant="link"
            className="text-sm text-myColor_red underline"
            onClick={() => setAddCategory(true)}
          >
            הקטגוריה הרצויה לא ברשימה?
          </Button>
        </div>
      )}

      <div>
        <label className="block mb-1 font-medium">תמונה</label>
        <ImageUploader onUploadComplete={(url) => setImage(url)} />
        {errors.includes('יש להעלות תמונה') && (
          <p className="text-sm text-red-600">יש להעלות תמונה</p>
        )}
      </div>

      <div className="space-y-4">
        {sections.map((section, index) => (
          <AddSection
            key={index}
            index={index}
            section={section}
            onChange={updateSection}
            onRemove={removeSection}
            mode={mode}
          />
        ))}
        <Button
          type="button"
          onClick={() =>
            setSections([...sections, { title: '', content: '', icon: '' }])
          }
        >
          הוסף קטע נוסף
        </Button>
      </div>

      <Button type="submit">
        {mode === 'edit' ? 'שמור שינויים' : 'צור מאמר'}
      </Button>

      {addCategory && (
        <Modal isOpen={addCategory} onClose={() => setAddCategory(false)}>
          <button
            type="button"
            className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
            onClick={() => setAddCategory(false)}
            aria-label="סגור חלון"
          >
            <MdClose size={24} />
          </button>
          <h3 className="text-lg font-semibold mb-4">הוספת קטגוריה חדשה</h3>
          <AddCategoryForm onAdd={handleAddCategory} />
        </Modal>
      )}
    </form>
  );
};

export default ArticleForm;
