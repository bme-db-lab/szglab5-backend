class CreateSemesters < ActiveRecord::Migration
  def change
    create_table :semesters do |t|
      t.belongs_to :course, null: false
      t.integer :academic_year, null: false
      t.integer :academic_term, null: false
      t.index [ :course_id, :academic_year, :academic_term ], unique: true, name: 'index_semesters_on_all_attributes'
    end
  end
end
