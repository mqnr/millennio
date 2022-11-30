export const ApiVersions = {
  v1() {
    return '/api/v1' as const;
  },
};

export const Endpoints = {
  listAssignments(courseId: string) {
    return `/courses/${courseId}/assignments` as const;
  },

  listCalendarEvents() {
    return `/calendar_events` as const;
  },

  listCalendarEventsForUser(userId: string) {
    return `/users/${userId}/calendar_events` as const;
  },

  getSingleCalendarEventOrAssignment(id: string) {
    return `/calendar_events/${id}` as const;
  },

  submitAssignment(courseId: string, assignmentId: string) {
    return `/api/v1/courses/${courseId}/assignments/${assignmentId}/submissions` as const;
  },

  uploadFileForSubmission(
    courseId: string,
    assignmentId: string,
    userId: string
  ) {
    return `/courses/${courseId}/assignments/${assignmentId}/submissions/${userId}/files` as const;
  },

  listAssignmentGroups(courseId: string) {
    return `/courses/${courseId}/assignment_groups` as const;
  },
};
