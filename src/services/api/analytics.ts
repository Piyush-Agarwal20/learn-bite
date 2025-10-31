import { supabase } from '../supabase';

/**
 * Get daily activity for the last 30 days
 */
export async function getDailyActivity(days: number = 30) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: new Error('Not authenticated') };
  }

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('user_progress')
    .select('completion_date')
    .eq('user_id', user.id)
    .eq('completed', true)
    .gte('completion_date', startDate.toISOString())
    .order('completion_date', { ascending: true });

  if (error) return { data: null, error };

  // Group by day
  const dailyData: { [key: string]: number } = {};

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    dailyData[dateKey] = 0;
  }

  data?.forEach((item: { completion_date: string }) => {
    const dateKey = item.completion_date.split('T')[0];
    if (dailyData[dateKey] !== undefined) {
      dailyData[dateKey]++;
    }
  });

  const result = Object.entries(dailyData)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return { data: result, error: null };
}

/**
 * Get completion rate by topic
 */
export async function getTopicCompletionRates() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: new Error('Not authenticated') };
  }

  const { data: topics } = await supabase
    .from('topics')
    .select('id, title, icon');

  if (!topics) return { data: null, error: null };

  const topicRates = await Promise.all(
    topics.map(async (topic) => {
      const { data: lessons } = await supabase
        .from('lessons')
        .select('id')
        .eq('topic_id', topic.id);

      const lessonCount = lessons?.length || 0;
      if (lessonCount === 0) {
        return { ...topic, completed: 0, total: 0, rate: 0 };
      }

      const { count } = await supabase
        .from('user_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('completed', true)
        .in('lesson_id', lessons!.map(l => l.id));

      const completedCount = count || 0;
      const rate = Math.round((completedCount / lessonCount) * 100);

      return {
        ...topic,
        completed: completedCount,
        total: lessonCount,
        rate,
      };
    })
  );

  return { data: topicRates, error: null };
}

/**
 * Get learning time statistics
 */
export async function getLearningTimeStats() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: new Error('Not authenticated') };
  }

  // Get all completed lessons with their estimated read times
  const { data: progress } = await supabase
    .from('user_progress')
    .select(`
      lesson_id,
      completion_date,
      lessons:lesson_id (
        estimated_read_time
      )
    `)
    .eq('user_id', user.id)
    .eq('completed', true);

  if (!progress) {
    return { data: { totalMinutes: 0, averagePerDay: 0, longestStreak: 0 }, error: null };
  }

  const totalMinutes = progress.reduce((sum: number, item: any) => {
    return sum + (item.lessons?.estimated_read_time || 0);
  }, 0);

  // Calculate average per active day
  const uniqueDates = new Set(
    progress.map((item: any) => item.completion_date?.split('T')[0])
  );
  const activeDays = uniqueDates.size;
  const averagePerDay = activeDays > 0 ? Math.round(totalMinutes / activeDays) : 0;

  // Calculate longest streak
  const sortedDates = Array.from(uniqueDates).sort();
  let longestStreak = 0;
  let currentStreak = 0;
  let lastDate: Date | null = null;

  sortedDates.forEach(dateStr => {
    const date = new Date(dateStr);
    if (lastDate) {
      const dayDiff = Math.floor((date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (dayDiff === 1) {
        currentStreak++;
      } else if (dayDiff > 1) {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }
    lastDate = date;
  });
  longestStreak = Math.max(longestStreak, currentStreak);

  return {
    data: {
      totalMinutes,
      totalHours: Math.floor(totalMinutes / 60),
      averagePerDay,
      activeDays,
      longestStreak,
    },
    error: null,
  };
}

/**
 * Get quiz performance statistics
 */
export async function getQuizPerformance() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: new Error('Not authenticated') };
  }

  // Note: This is a placeholder since we don't track quiz scores yet
  // In a real implementation, you'd have a quiz_results table
  return {
    data: {
      totalQuizzes: 0,
      averageScore: 0,
      perfectScores: 0,
    },
    error: null,
  };
}

/**
 * Get learning pattern insights
 */
export async function getLearningPatterns() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: new Error('Not authenticated') };
  }

  const { data: progress } = await supabase
    .from('user_progress')
    .select('completion_date')
    .eq('user_id', user.id)
    .eq('completed', true);

  if (!progress || progress.length === 0) {
    return {
      data: {
        preferredHours: [],
        preferredDays: [],
        mostProductiveTime: 'Not enough data',
      },
      error: null,
    };
  }

  // Analyze by hour
  const hourCounts: { [key: number]: number } = {};
  const dayCounts: { [key: string]: number } = {
    'Sunday': 0,
    'Monday': 0,
    'Tuesday': 0,
    'Wednesday': 0,
    'Thursday': 0,
    'Friday': 0,
    'Saturday': 0,
  };

  progress.forEach((item: { completion_date: string }) => {
    const date = new Date(item.completion_date);
    const hour = date.getHours();
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    dayCounts[dayName] = (dayCounts[dayName] || 0) + 1;
  });

  // Find preferred hours (top 3)
  const preferredHours = Object.entries(hourCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([hour]) => parseInt(hour));

  // Find preferred days (top 3)
  const preferredDays = Object.entries(dayCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([day]) => day);

  // Determine most productive time
  const mostProductiveHour = preferredHours[0];
  let mostProductiveTime = 'Morning';
  if (mostProductiveHour >= 12 && mostProductiveHour < 17) {
    mostProductiveTime = 'Afternoon';
  } else if (mostProductiveHour >= 17 && mostProductiveHour < 21) {
    mostProductiveTime = 'Evening';
  } else if (mostProductiveHour >= 21 || mostProductiveHour < 6) {
    mostProductiveTime = 'Night';
  }

  return {
    data: {
      preferredHours,
      preferredDays,
      mostProductiveTime,
    },
    error: null,
  };
}
