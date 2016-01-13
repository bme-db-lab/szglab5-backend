# TODO: documentation
# TODO: description
# TODO: short_description
#
class Event < ActiveRecord::Base
  belongs_to :student_group
  belongs_to :event_template
  belongs_to :demonstrator, class_name: 'Staff'
  has_many :students, through: :student_to_event
  belongs_to :exercise_type
  belongs_to :upstream_event, class_name: 'Event'
  has_many :related_events, class_name: 'Event', foreign_key: 'upstream_event_id'
  has_many :deliverables
  has_many :evaluations, as: :evaluatable
end
