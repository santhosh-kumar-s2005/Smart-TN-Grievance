/**
 * Modern Complaint Form Example Page
 * Demonstrates form components, real-time scoring, and validation
 */

'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Button, Input, Select, Card, Badge, LoadingSpinner } from '@/components/ui';
import {
  containerVariants,
  itemVariants,
  pageVariants,
} from '@/animations/variants';
import { AppLayout } from '@/components/layouts';
import { calculatePriorityWithScore } from '@/lib/priorityScorer';
import {
  getPriorityColor,
  getPriorityIcon,
} from '@/utils/ui-helpers';
import { theme } from '@/theme';

const CATEGORIES = [
  { value: 'road-infrastructure', label: 'Road Infrastructure' },
  { value: 'water-supply', label: 'Water Supply' },
  { value: 'electricity', label: 'Electricity' },
  { value: 'sanitation', label: 'Sanitation' },
  { value: 'other', label: 'Other' },
];

const DEPARTMENTS = [
  { value: 'pwd', label: 'Public Works Department' },
  { value: 'water', label: 'Water Supply' },
  { value: 'electricity', label: 'Electricity Board' },
  { value: 'civic', label: 'Civic Body' },
];

interface FormData {
  title: string;
  description: string;
  category: string;
  department: string;
  location: string;
  attachments: File[];
}

interface FormErrors {
  title?: string;
  description?: string;
  category?: string;
  department?: string;
  location?: string;
}

export default function ComplaintFormExample() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    department: '',
    location: '',
    attachments: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Real-time priority scoring
  const priorityScore = useMemo(() => {
    if (!formData.description) return null;
    return calculatePriorityWithScore({
      description: formData.description,
      category: formData.category,
      status: 'pending',
      createdAt: new Date(),
    });
  }, [formData.description, formData.category]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Complaint title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);

    // Mark as submitted
    setSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        title: '',
        description: '',
        category: '',
        department: '',
        location: '',
        attachments: [],
      });
      setSubmitted(false);
    }, 3000);
  };

  if (submitted) {
    return (
      <AppLayout userName="User" userRole="user">
        <motion.div
          className="max-w-2xl mx-auto py-12 text-center"
          variants={pageVariants}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            animate={{ scale: [0.8, 1, 1], rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </motion.div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Complaint Submitted Successfully!
          </h2>

          <p className="text-gray-600 mb-6">
            Your complaint has been registered. Reference ID: #
            {Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">
              You can track your complaint status in the dashboard. Our team will
              review and take action shortly.
            </p>
          </div>

          <Button variant="primary" onClick={() => setSubmitted(false)}>
            File Another Complaint
          </Button>
        </motion.div>
      </AppLayout>
    );
  }

  const PriorityIcon = priorityScore
    ? getPriorityIcon(priorityScore.priority as any)
    : null;

  return (
    <AppLayout userName="User" userRole="user">
      {/* Page Title */}
      <motion.div
        className="mb-8"
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        <h1 className="text-3xl font-bold text-gray-900">File a Complaint</h1>
        <p className="text-gray-600 mt-2">
          Report your grievance and help us improve public services
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <motion.div
          className="lg:col-span-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card variant="elevated" padding="lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title Field */}
              <motion.div variants={itemVariants}>
                <Input
                  label="Complaint Title"
                  placeholder="Brief summary of the issue"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    if (errors.title) {
                      setErrors({ ...errors, title: '' });
                    }
                  }}
                  error={errors.title}
                  leftIcon={<AlertCircle className="w-4 h-4" />}
                  disabled={isSubmitting}
                />
              </motion.div>

              {/* Category & Department */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                variants={itemVariants}
              >
                <Select
                  options={CATEGORIES}
                  value={formData.category}
                  onChange={(value) => {
                    setFormData({ ...formData, category: value as string });
                    if (errors.category) {
                      setErrors({ ...errors, category: '' });
                    }
                  }}
                  label="Category"
                  placeholder="Select category"
                  error={errors.category}
                  disabled={isSubmitting}
                />

                <Select
                  options={DEPARTMENTS}
                  value={formData.department}
                  onChange={(value) => {
                    setFormData({ ...formData, department: value as string });
                    if (errors.department) {
                      setErrors({ ...errors, department: '' });
                    }
                  }}
                  label="Department"
                  placeholder="Select department"
                  error={errors.department}
                  disabled={isSubmitting}
                />
              </motion.div>

              {/* Description */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Describe the issue in detail..."
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    if (errors.description) {
                      setErrors({ ...errors, description: '' });
                    }
                  }}
                  className={`w-full px-4 py-2.5 bg-white border rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${
                    errors.description
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  rows={5}
                  disabled={isSubmitting}
                />
                {errors.description && (
                  <motion.p
                    className="text-xs font-medium mt-2 text-red-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.description}
                  </motion.p>
                )}
              </motion.div>

              {/* Location */}
              <motion.div variants={itemVariants}>
                <Input
                  label="Location"
                  placeholder="Where is the issue located?"
                  value={formData.location}
                  onChange={(e) => {
                    setFormData({ ...formData, location: e.target.value });
                    if (errors.location) {
                      setErrors({ ...errors, location: '' });
                    }
                  }}
                  error={errors.location}
                  leftIcon={<MapPin className="w-4 h-4" />}
                  disabled={isSubmitting}
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants} className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isSubmitting}
                  rightIcon={!isSubmitting && <Send className="w-4 h-4" />}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                </Button>
              </motion.div>
            </form>
          </Card>
        </motion.div>

        {/* Priority Preview */}
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card variant="gradient" padding="lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Priority Analysis
            </h3>

            {priorityScore ? (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  {PriorityIcon && (
                    <PriorityIcon className="w-6 h-6 flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-xs text-gray-500">Predicted Priority</p>
                    <p className="text-xl font-bold text-gray-900">
                      {priorityScore.priority}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">Priority Score</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(priorityScore.score / 100) * 100}%`,
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {priorityScore.score}
                    </p>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="p-3 bg-white rounded-lg space-y-2">
                  <p className="text-xs font-semibold text-gray-900 mb-3">
                    Score Breakdown
                  </p>

                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Keywords</span>
                    <span className="font-semibold text-gray-900">
                      +{priorityScore.keywordScore}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Urgency</span>
                    <span className="font-semibold text-gray-900">
                      +{priorityScore.severityBoost}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Category</span>
                    <span className="font-semibold text-gray-900">
                      +{priorityScore.categoryBoost}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Recency</span>
                    <span className="font-semibold text-gray-900">
                      +{priorityScore.recencyBoost}
                    </span>
                  </div>
                </div>

                {/* Matched Keywords */}
                {priorityScore.matchedKeywords.length > 0 && (
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-xs font-semibold text-gray-900 mb-2">
                      Matched Keywords
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {priorityScore.matchedKeywords
                        .slice(0, 3)
                        .map((keyword, idx) => (
                          <Badge key={idx} variant="info" size="sm">
                            {keyword}
                          </Badge>
                        ))}
                      {priorityScore.matchedKeywords.length > 3 && (
                        <Badge variant="info" size="sm">
                          +{priorityScore.matchedKeywords.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                className="py-8 text-center text-gray-500"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  Start typing to see priority analysis
                </p>
              </motion.div>
            )}
          </Card>

          {/* Tips Card */}
          <Card variant="default" padding="md" className="bg-blue-50 border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-2">💡 Tips</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Be specific and detailed</li>
              <li>• Include exact location</li>
              <li>• Mention urgency if applicable</li>
              <li>• Provide photo if possible</li>
            </ul>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}
