export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  deadline: string;
  assignedTo: string;
  assignedVolunteerName?: string;
  wardOrBooth: string;
  category: 'Voter Contact' | 'Slip Distribution' | 'Banner Setup' | 'Rally Prep' | 'Grievance Resolution';
  createdDate: string;
  completedDate?: string;
}

export type ActivityType = 'Door-to-Door' | 'Panna Slip Handover' | 'Corner Meeting' | 'Poster Pasting' | 'Voter Verification' | 'Rally Coordination';

export interface FieldActivity {
  id: string;
  volunteerId: string;
  volunteerName: string;
  ward: string;
  boothNo: string;
  activityType: ActivityType;
  location: string;
  dateTime: string;
  description: string;
  photoUrl?: string;
  votersContacted: number;
  slipsDistributed: number;
  status: 'Submitted' | 'Verified' | 'Flagged';
}

export interface AttendanceRecord {
  id: string;
  volunteerId: string;
  volunteerName: string;
  ward: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  location: string;
  status: 'Present' | 'On-Duty' | 'Leave' | 'Absent';
}
