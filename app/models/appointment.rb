# TODO: documentation
#
class Appointment < ActiveRecord::Base
  belongs_to :student_group
  belongs_to :event_template
end
