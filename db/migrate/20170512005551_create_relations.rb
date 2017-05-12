class CreateRelations < ActiveRecord::Migration[5.0]
  def change
    create_table :premises_sources, id: false do |t|
      t.belongs_to :premise, index: true
      t.belongs_to :source, index: true
    end
    create_table :premises_arguments, id: false do |t|
      t.belongs_to :premise, index: true
      t.belongs_to :argument, index: true
    end
  end
end
