# TODO: documentation
# TODO: description
# TODO: short_description
#
class Event < ActiveRecord::Base
  belongs_to :student_group
  belongs_to :event_template
  belongs_to :demonstrator, class_name: 'Staff'
  belongs_to :student
  belongs_to :exercise_type
  belongs_to :upstream_event, class_name: 'Event'
  has_many :related_events, class_name: 'Event', foreign_key: 'upstream_event_id'
  has_many :deliverables
end
