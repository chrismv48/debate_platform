class ArgumentsController < ApplicationController
  before_action :set_argument, only: [:show, :edit, :update, :destroy, :argument_tree]

  # GET /arguments
  # GET /arguments.json
  def index
    @arguments = Argument.all
  end

  # GET /arguments/1
  # GET /arguments/1.json
  def show
  end

  # GET /arguments/new
  def new
    @argument = Argument.new
    @premises = Premise.where({argument_id: nil}).all
  end

  # GET /arguments/1/edit
  def edit
    @premises = Premise.where({argument_id: nil}).all
  end

  # POST /arguments
  # POST /arguments.json
  def create
    @argument = Argument.new(argument_params)

    respond_to do |format|
      begin
        ActiveRecord::Base.transaction do
          @argument.save!
          @argument.premise_ids = premise_ids[:premise_ids]
          format.html {redirect_to @argument, notice: 'Argument was successfully created.'}
          format.json {render :show, status: :created, location: @argument}
        end
      rescue ActiveRecord::RecordInvalid => exception
        format.html {render :new}
        format.json {render json: @argument.errors, status: :unprocessable_entity}
      end
    end
  end

  # PATCH/PUT /arguments/1
  # PATCH/PUT /arguments/1.json
  def update
    respond_to do |format|
      begin
        ActiveRecord::Base.transaction do
          @argument.update(argument_params)
          @argument.premise_ids = premise_ids[:premise_ids]
          format.html {redirect_to @argument, notice: 'Argument was successfully updated.'}
          format.json {render :show, status: :ok, location: @argument}
        end
      rescue ActiveRecord::RecordInvalid
        format.html {render :edit}
        format.json {render json: @argument.errors, status: :unprocessable_entity}
      end
    end
  end

  # DELETE /arguments/1
  # DELETE /arguments/1.json
  def destroy
    @argument.destroy
    respond_to do |format|
      format.html {redirect_to arguments_url, notice: 'Argument was successfully destroyed.'}
      format.json {head :no_content}
    end
  end

  # GET /arguments/1/argument_tree
  def argument_tree
    render json: @argument.get_tree
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_argument
    @argument = Argument.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def argument_params
    params.require(:argument).permit(:name)
  end

  def premise_ids
    params.permit(premise_ids: [])
  end
end
