import { google } from 'googleapis';

export class CalendarService {
  private calendar = google.calendar('v3');
  private auth;

  constructor() {
    this.auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });
  }

  /**
   * Create a calendar event with Google Meet link
   */
  async createEvent(details: {
    summary: string;
    description: string;
    startTime: Date;
    endTime: Date;
    attendees: string[];
  }) {
    try {
      const response = await this.calendar.events.insert({
        auth: this.auth,
        calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
        conferenceDataVersion: 1,
        requestBody: {
          summary: details.summary,
          description: details.description,
          start: {
            dateTime: details.startTime.toISOString(),
            timeZone: 'UTC', // Or use process.env.TIMEZONE
          },
          end: {
            dateTime: details.endTime.toISOString(),
            timeZone: 'UTC',
          },
          attendees: details.attendees.map((email) => ({ email })),
          conferenceData: {
            createRequest: {
              requestId: `zagotours-${Date.now()}`,
              conferenceSolutionKey: { type: 'hangoutsMeet' },
            },
          },
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 24 * 60 }, // 1 day before
              { method: 'popup', minutes: 30 }, // 30 minutes before
            ],
          },
        },
      });

      return {
        id: response.data.id,
        meetingLink:
          response.data.hangoutLink ||
          response.data.conferenceData?.entryPoints?.[0]?.uri,
      };
    } catch (error) {
      console.error('Google Calendar API Error:', error);
      throw new Error(`Failed to create calendar event: ${error}`);
    }
  }

  /**
   * Update an existing calendar event
   */
  async updateEvent(
    eventId: string,
    details: {
      summary?: string;
      description?: string;
      startTime?: Date;
      endTime?: Date;
      attendees?: string[];
    },
  ) {
    try {
      const updateData: any = {};

      if (details.summary) updateData.summary = details.summary;
      if (details.description) updateData.description = details.description;
      if (details.startTime) {
        updateData.start = {
          dateTime: details.startTime.toISOString(),
          timeZone: 'UTC',
        };
      }
      if (details.endTime) {
        updateData.end = {
          dateTime: details.endTime.toISOString(),
          timeZone: 'UTC',
        };
      }
      if (details.attendees) {
        updateData.attendees = details.attendees.map((email) => ({ email }));
      }

      const response = await this.calendar.events.update({
        auth: this.auth,
        calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
        eventId: eventId,
        requestBody: updateData,
      });

      return {
        id: response.data.id,
        meetingLink:
          response.data.hangoutLink ||
          response.data.conferenceData?.entryPoints?.[0]?.uri,
      };
    } catch (error) {
      console.error('Failed to update calendar event:', error);
      throw new Error(`Failed to update calendar event: ${error}`);
    }
  }

  /**
   * Delete a calendar event
   */
  async deleteEvent(eventId: string) {
    try {
      await this.calendar.events.delete({
        auth: this.auth,
        calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
        eventId: eventId,
        sendUpdates: 'all', // Notify all attendees
      });

      return { success: true };
    } catch (error) {
      console.error('Failed to delete calendar event:', error);
      throw new Error(`Failed to delete calendar event: ${error}`);
    }
  }

  /**
   * Get event details
   */
  async getEvent(eventId: string) {
    try {
      const response = await this.calendar.events.get({
        auth: this.auth,
        calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
        eventId: eventId,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to get calendar event:', error);
      throw new Error(`Failed to get calendar event: ${error}`);
    }
  }
}
