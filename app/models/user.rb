# TODO: documentation
#
class User < ActiveRecord::Base
  has_many :students, inverse_of: :user
  has_many :staffs, inverse_of: :user
end
